/**
 * Created by luis on 1/25/16.
 */
Meteor.startup(function () {
    // code to run on server at startup
    if (!Websites.findOne()){
        console.log("No websites yet. Creating starter data.");
        Websites.insert({
            title:"Goldsmiths Computing Department",
            url:"http://www.gold.ac.uk/computing/",
            description:"This is where this course was developed.",
            createdOn:new Date(),
            votesUp: 0,
            votesDown: 0,
            voters: [],
            comments: []
        });
        Websites.insert({
            title:"University of London",
            url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route",
            description:"University of London International Programme.",
            createdOn:new Date(),
            votesUp: 0,
            votesDown: 0,
            voters: [],
            comments: []
        });
        Websites.insert({
            title:"Coursera",
            url:"http://www.coursera.org",
            description:"Universal access to the world’s best education.",
            createdOn:new Date(),
            votesUp: 0,
            votesDown: 0,
            voters: [],
            comments: []
        });
        Websites.insert({
            title:"Google",
            url:"http://www.google.com",
            description:"Popular search engine.",
            createdOn:new Date(),
            votesUp: 0,
            votesDown: 0,
            voters: [],
            comments: []
        });
    }
});

