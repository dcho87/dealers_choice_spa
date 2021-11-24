const Sequelize = require('sequelize');
const { STRING } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || "postgres://localhost/dealers_choice_spa");
const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());

app.use('/dist', express.static(path.join(__dirname, "dist")));

const teams = ['Atlanta Hawks', 'Charlotte Hornets', 'Miami Heats', 'Orlando Magic', 'Boston Celtics','Brooklyn Nets', 'New York Knicks', 'Philadelphia 76ers', 'Golden State Warriors','Los Angeles Lakers', 'Chicago Bulls', 'Cleveland Cavaliers', 'Denver Nuggets', 'Utah Jazz', 'Phoenix Suns', 'Dallas Mavericks', 'Houston Rockets', 'Washington Wizards', 'Toronto Raptors', 'LA Clippers', 'Sacramento Kings', 'Detroit Pistons', 'Indiana Pacers','Milwaukee Bucks', 'Minnesota Timberwolves', 'Oklahoma City Thunders', 'Portland Trail Blazers', 'Memphis Grizzlies', 'New Orleans Pelicans', 'San Antonio Spurs']
const regions = ['Atlantic', 'Central', 'SouthEast', 'NorthWest', 'Pacific', 'SouthWest']

const syncAndSeed = async () => {
    await conn.sync({ force: true });
    const [atlanta_hawks, charlotte_hornets, miami_heats, orlando_magic, boston_celtics, brooklyn_nets, new_york_knicks, philadelphia_76ers, golden_state_warriors,los_angeles_lakers, chicago_bulls, cleveland_cavaliers, denver_nuggets, utah_jazz, phoenix_suns, dallas_mavericks, houston_rockets, washington_wizards, toronto_raptors, la_clippers, sacramento_kings, detroit_pistons, indiana_pacers, milwaukee_bucks, minnesota_timberwolves,oklahoma_city, portland_trail, memphis_grizzlies, new_orleans, san_antonio] = await Promise.all(
        teams.map(name => Team.create({name: name}))
    )
    const [atlantic, central, southEast, northWest, pacific, southWest] = await Promise.all(
        regions.map(name => Region.create({name}))
    )
        await Promise.all([
            atlanta_hawks.update({regionId: southEast.id}),
            charlotte_hornets.update({regionId: southEast.id}),
            miami_heats.update({regionId: southEast.id}),
            orlando_magic.update({regionId: southEast.id}),
            boston_celtics.update({regionId: atlantic.id}),
            brooklyn_nets.update({regionId: atlantic.id}),
            new_york_knicks.update({regionId: atlantic.id}),
            philadelphia_76ers.update({regionId: atlantic.id}),
            golden_state_warriors.update({regionId: pacific.id}),
            los_angeles_lakers.update({regionId: pacific.id}),
            chicago_bulls.update({regionId: central.id}),
            cleveland_cavaliers.update({regionId: central.id}),
            denver_nuggets.update({regionId: northWest.id}),
            utah_jazz.update({regionId: northWest.id}),
            phoenix_suns.update({regionId: pacific.id}),
            dallas_mavericks.update({regionId: southWest.id}),
            houston_rockets.update({regionId: southWest.id}),
            washington_wizards.update({regionId: southEast.id}),
            toronto_raptors.update({regionId: atlantic.id}),
            la_clippers.update({regionId: pacific.id}),
            sacramento_kings.update({regionId: pacific.id}),
            detroit_pistons.update({regionId: central.id}),
            indiana_pacers.update({regionId: central.id}),
            milwaukee_bucks.update({regionId: central.id}),
            minnesota_timberwolves.update({regionId: northWest.id}),
            oklahoma_city.update({regionId: northWest.id}),
            portland_trail.update({regionId: northWest.id}),
            memphis_grizzlies.update({regionId: southWest.id}),
            new_orleans.update({regionId: southWest.id}),
            san_antonio.update({regionId: southWest.id}),
        ])
}

const Region = conn.define('region', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true,
    }
});
const Team = conn.define('team', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }
})
const Player = conn.define('player', {
    name: {
        type: STRING,
    }
})

Team.belongsTo(Region);
Region.hasMany(Team);
Player.belongsTo(Team);
Team.hasMany(Player);

app.get("/", (req, res, next) =>
  res.sendFile(path.join(__dirname, "index.html"))
);

app.get('/api/regions', async (req, res, next) => {
    try{
        res.send(await Region.findAll());
    }
    catch(ex){
        next(ex)
    }
})

app.get('/api/teams', async (req, res, next) => {
    try{
        res.send(await Team.findAll());
    }
    catch(ex){
        next(ex)
    }
})

app.get('/api/regions/:regionId/teams', async (req, res, next) => {
    try{
        res.send(
            await Team.findAll({
                where: { regionId: req.params.regionId}
            }));
    }
    catch(ex){
        next(ex)
    }
})

const init = async () => {
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, () => `listening on port ${port}`);
}

init();