/**
 * Created by luis on 1/25/16.
 */
Meteor.subscribe("users");

Tracker.autorun(function() {
    Meteor.subscribe("websites-all", Session.get("searchTerms"));
});

Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
});

/// routing

Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
    this.render('sites');
});

Router.route('/site/:_id', function () {
    this.render('site_details', {
        data: function () {
            return Websites.findOne({_id: this.params._id});
        }
    });
});

/////
// template helpers
/////
Template.registerHelper("getUser", function(userId) {
    var user = Meteor.users.findOne({_id: userId});

    if (user) {
        return user.username;
    }
    else {
        return "anon";
    }
});

Template.registerHelper('formatTime', function(time) {
    return moment(time).format('LLLL');
});

// helper function that returns all available websites
Template.website_list.helpers({
    websites: function () {
        return Websites.find({}, {sort: {votesUp: -1, votesDown: 1}});
    }
});

Template.website_item.helpers({
    votingAllowed: function () {
        var userId = Meteor.userId();
        return userId !== null && this.voters.indexOf(userId) === -1;
    }
});

/////
// template events
/////

Template.navbar.events({
    "click .js-search": function (event, tpl) {
        var terms = tpl.$('input[name="search"]').val();
        Session.set("searchTerms", terms);
    },
    "click .js-clear-search": function(event, tpl) {
        var terms = tpl.$('input[name="search"]').val('');
        Session.set("searchTerms", '');
    }
});

Template.website_item.events({
    "click .js-upvote": function (event) {
        // example of how you can access the id for the website in the database
        // (this is the data context for the template)
        var website_id = this._id;

        // put the code in here to add a vote to a website!
        Websites.update({_id: website_id}, {
            $inc: {votesUp: 1},
            $push: {voters: Meteor.userId()}
        });
    },
    "click .js-downvote": function (event) {
        // example of how you can access the id for the website in the database
        // (this is the data context for the template)
        var website_id = this._id;

        // put the code in here to remove a vote from a website!
        Websites.update({_id: website_id}, {
            $inc: {votesDown: 1},
            $push: {voters: Meteor.userId()}
        });
    }
});

Template.website_form.events({
    "click .js-toggle-website-form": function (event, tpl) {
        tpl.$(".alert").text("").hide();
        tpl.$("input").val("");
        $("#website_form").modal('show');
    },
    "click .js-check-url": function (event, tpl) {
        var url = tpl.$('input[name="url"]').val();

        if (url.length !== 0) {
            Meteor.call("checkUrl", url, function(err, result) {
                tpl.$('input[name="title"]').val(result.title);
                tpl.$('input[name="description"]').val(result.description);
            });
        }
    },
    "submit .js-save-website-form": function (event, tpl) {
        var url = event.target.url.value,
            title = event.target.title.value,
            description = event.target.description.value;

        if (url.length === 0 || title.length === 0 || description.length === 0) {
            tpl.$(".alert").text("All fields are required.").show();
        }
        else {
            //  put your website saving code in here!
            Websites.insert({
                title: title,
                url: url,
                description: description,
                createdOn: new Date(),
                createdBy: Meteor.user()._id,
                votesUp: 0,
                votesDown: 0,
                voters: [],
                comments: []
            });

            $("#website_form").modal('hide');
        }

        return false; // stop the form submit from reloading the page
    }
});

Template.comment_form.events({
    "click .js-toggle-comment-form": function (event) {
        $("#comment_form").toggle('slow');
    },
    "submit .js-post-comment-form": function (event) {
        var comment = event.target.comment.value;

        if (comment.length !== 0) {
            Websites.update({_id: this._id}, {
                $push: {
                    comments: {
                        comment: comment,
                        postedOn: new Date(),
                        postedBy: Meteor.user()._id
                    }
                }
            });

            $("#comment_form").hide().find("input").val("");
        }

        return false; // stop the form submit from reloading the page
    }
});
