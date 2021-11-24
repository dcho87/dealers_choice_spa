const axios = require('axios');
const regionList = document.getElementById('regions');
const teamList = document.getElementById('teams');

let regions, teams;

const renderRegions = () => {
    const html = regions
    .map(
        (region) => `
        <li>
        <a href='#${region.id}'>
        ${region.name}
        </a>
        </li>
        `
    ).join('')
    regionList.innerHTML = html
}

const renderTeams = () => {
    const html = teams.map(
        (team) => {
            const region = regions.find(
                region => region.id === team.regionId
              );
        return `
        <li>
        ${team.name}</li>
        `
        }).join('')
    teamList.innerHTML = html
}

const fetchTeam = async() => {
    const regionId = window.location.hash.slice(1);
    teams = (await axios.get(`/api/regions/${regionId}/teams`)).data
    renderTeams();
}

const init = async () => {
    try{
        regions = (await axios.get("/api/regions")).data
        teams = (await axios.get("api/teams")).data
        renderRegions();
        renderTeams();
        const regionId = window.location.hash.slice(1);
        if(regionId) {
            fetchTeam();
        }
    }
    catch(ex){
        console.log(ex)
    }
}

window.addEventListener("hashchange", async () => {
    fetchTeam();
    renderTeams();
})

init();