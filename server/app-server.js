/**
 * Created by luis on 1/25/16.
 */
Websites._ensureIndex({
    "title": "text",
    "description": "text"
});

// server: publish the websites collection
Meteor.publish("websites-all", function (searchTerms) {
    if (!searchTerms) {
        return Websites.find({});
    }
    else {
        return Websites.find({ $text: {$search: searchTerms} });
    }
});

Meteor.publish("users", function () {
    return Meteor.users.find({}, {fields: {username: 1}});
});

Meteor.methods({
    checkUrl: function(url) {
        var content = Meteor.http.get(url).content;
        var $ = cheerio.load(content);

        return {
            title: $('title').text().trim(),
            description: $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content')
        };
    }
});