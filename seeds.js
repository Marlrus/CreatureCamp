const   mongoose    = require("mongoose"),
        Campground  = require("./models/campgrounds"),
        Comment     = require("./models/comment"),
        User        = require("./models/user")

let seeds = [
    {
        name: "Marmot Prairie",
        image: "https://www.bestofthetetons.com/wp-content/uploads/2019/04/Marmot2017_12-678x381.jpg",
        description: "Peaceful praire full of welcoming, friendly creatures. Bring extra food! For these creatures love being fed at food-o-clock. Ask them when food-o-clock is!"
    },
    {
        name: "Walrus Mountain",
        image: "https://external-preview.redd.it/yAQ7KXXLVy7wGUkU9yFIJwCbNHvHpXhnOL_j8xuNLkc.jpg?auto=webp&s=2bc7fe7dd13c56afd0571ac3d7996cb48bd44de5",
        description: "Purrfect for walruses that loeve thermal waterses!"
    },
    {
        name: "Slenia Castle",
        image: "https://i.etsystatic.com/10579689/r/il/58d5cb/907921243/il_794xN.907921243_gxag.jpg",
        description: "Never the same, has to be rebuilt constantly due to the inhabitants destructive nature uWu"
    }
]



function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

async function seedDB() {
    try {
        await wait(10)
        console.log("0.01s delay");
        await Promise.all([
            Comment.deleteMany({}),
            Campground.deleteMany({}),
            //new code
            User.deleteMany({}),
            console.log("In the delete promise")
        ])
        console.log("Comments, Campgrounds, and Users Removed");
        for(let seed of seeds) {
            console.log("Starting Campground Creation");
            //Create campground and comment simultaneously
            let [campground, comment] = await Promise.all([
                Campground.create(seed),
                Comment.create({
                    text:"I loveses it!",
                    author: "Homer"
                })
            ])
            console.log("Campground AND Comment created!");
            await campground.comments.push(comment)
            await campground.save()
            console.log("Comment added to Campground");
        }  
    } catch (err) {
        console.log(err);
    }
}

module.exports = seedDB;