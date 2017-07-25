  var txt = "";
var baseURL = "http://gd2.mlb.com";
var scores = [];
var homeRos = [];
var awayRos= [];

function loadXMLDoc(url) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            fillTables(this);
        }
    };
    try{
        xmlhttp.open("GET", url + "boxscore.xml", true);
        xmlhttp.send();
    } catch(e){
        console.log("error")
    }
}
/* function updateLineTxt(team, scores, r, h, e) {
    console.log(scores.length);
    txt +=
        "<tr><td>" +
        team +
        "</td><td>" +
        scores[0] +
        "</td><td>" +
        scores[1] +
        "</td><td>" +
        scores[2] +
        "</td><td>" +
        scores[3] +
        "</td><td>" +
        scores[4] +
        "</td><td>" +
        scores[5] +
        "</td><td>" +
        scores[6] +
        "</td><td>" +
        scores[7] +
        "</td><td>" +
        scores[8] +
        "</td><td>" +
        r +
        "</td><td>" +
        h +
        "</td><td>" +
        r +
        "</td></tr>";
} */

function updateLineTxt(team, scores, r, h, e) {
    console.log(scores.length);
    txt += "<tr><td>" + team
    for(var i = 0;i<scores.length;i++){
        txt +="</td><td>"+scores[i];
    }
    txt += "</td><td>" + r +
        "</td><td>" +
        h +
        "</td><td>" +
        e +
        "</td></tr>";
}

function teamParse(flag, xml) {
    var x, i, xmlDoc;
    xmlDoc = xml.responseXML;
    txt = "";
    if(flag=='away'){
        awayRos=[];
    } else {
        homeRos=[];
    }
    x = xmlDoc.getElementsByTagName("batting");
    for (i = 0; i < x.length; i++) {
        if (x[i].attributes["team_flag"].value == flag) {
            for (var j = 0; j < x[i].childNodes.length; j ++) {
                try {
                    if (x[i].childNodes[j].attributes["pos"].value !== "P") {
                       if(flag=="away"){
                           awayRos.push(new playerObject(flag, x[i].childNodes[j].attributes["id"].value,x[i].childNodes[j].attributes["name"].value,x[i].childNodes[j].attributes["pos"].value))
                           
                        } else {
                            homeRos.push(new playerObject(flag, x[i].childNodes[j].attributes["id"].value,x[i].childNodes[j].attributes["name"].value,x[i].childNodes[j].attributes["pos"].value))
                            
                        }
                       
                        
                    }
                } catch (e) {
                    continue;
                }
            }
        }
    }
    if(flag=="away"){
        for(var i=0;i<awayRos.length;i++){
            txt +="<tr><td>" + awayRos[i].id + "</td><td>" + awayRos[i].name + "</td><td>" + awayRos[i].pos + "</td></tr>";
        }
    } else {
        for(var i=0;i<homeRos.length;i++){
            txt +="<tr><td>" + homeRos[i].id + "</td><td>" + homeRos[i].name + "</td><td>" + homeRos[i].pos + "</td></tr>";
        }
    }
    document.getElementById(flag + "-Roster").innerHTML += txt;
    
}

function createTables(type){
    if(type=='roster'){

    }
    else if (type=='lineScore'){
        //var tbl = "<table><thead><tr><td></td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>R</td><td>H</td><td>E</td></tr></thead><tbody id='Line'></tbody></table>";
        var tbl = "<table><thead><tr><td></td>"
        console.log(scores.length);
        for(var i=0; i<scores.length;i++){
            var inn = i+1
            console.log(inn);
            tbl += "<td>"+inn+"</td>"
        }
        tbl += "<td>R</td><td>H</td><td>E</td></tr></thead><tbody id='Line'></tbody></table>"
        document.getElementById("lineScore").innerHTML = tbl;
    }
}

function fillTables(xml) {
    document.getElementById("rosters").innerHTML ="<table class='awayRoster'><thead><tr><td>MLB ID</td><td>Name</td><td>Position</td></tr></thead><tbody id='away-Roster'></tbody></table><table class='homeRoster'><thead><tr><td>MLB ID</td><td>Name</td><td>Position</td></tr></thead><tbody id='home-Roster'></tbody></table>";
    teamParse("away", xml);
    teamParse("home", xml);
    
    linescoreParse("away", xml, true);
    linescoreParse("home", xml, false);
    
}

window.onload = function() {
    document.getElementById("findGame").addEventListener(
        "click",
        function() {
            games = findGames(
                document.getElementById("mon").value,
                document.getElementById("day").value,
                document.getElementById("year").value
            );
            x = document.getElementsByClassName("game");
        },
        false
    );
};

function linescoreParse(flag, xml, create) {
    var x, i, xmlDoc;
    xmlDoc = xml.responseXML;
    txt = "";
    x = xmlDoc.getElementsByTagName("boxscore");
    scores = [];
    var team = x[0].attributes[flag + "_sname"].value;
    for (i = 0; i < x.length; i++) {
        var tmpR = x[i].childNodes[1].attributes[flag + "_team_runs"].value;
        var tmpH = x[i].childNodes[1].attributes[flag + "_team_hits"].value;
        var tmpE = x[i].childNodes[1].attributes[flag + "_team_errors"].value;
        for (var j = 0; j < x[i].childNodes[1].childNodes.length; j++) {
            try {
                scores.push(x[i].childNodes[1].childNodes[j].attributes[flag].value);
            } catch (e) {
                continue;
            }
        }
    }
    if(create){
        createTables('lineScore')
    }
    updateLineTxt(team, scores, tmpR, tmpH, tmpE);
    document.getElementById("Line").innerHTML += txt;
    linescoreClean();
}

function findGames(mon, day, year) {
    document.getElementById("games").innerHTML = "";
    var games = [];
    var urlOpen = new XMLHttpRequest();
    urlOpen.open(
        "GET",
        "http://gd2.mlb.com/components/game/mlb/year_" +
        year +
        "/month_" +
        mon +
        "/day_" +
        day +
        "/epg.xml",
        true
    );
    urlOpen.send();
    urlOpen.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var game = this.responseXML.getElementsByTagName("game");
            for (var i = 0; i < game.length; i++) {
                games.push(
                    new gameObject(
                        //game[i].attributes["game_data_directory"].value)[0]
                        analyseDir(game[i].attributes["home_team_city"].value,game[i].attributes["away_team_city"].value)[1],
                        analyseDir(game[i].attributes["home_team_city"].value,game[i].attributes["away_team_city"].value)[0],
                        game[i].attributes["game_data_directory"].value,
                        game[i].attributes['time_date'].value.substr(10, game[i].attributes['time_date'].value.length),
                        game[i].attributes['ampm'].value
                    )
                );
                games[i].publish();
            }
        }
    };
    return games;
}

function analyseDir(homeTm, awayTm) {
    homeCode = homeTm;
    awayCode = awayTm;
    return [homeCode, awayCode];
}

function gen(game) {
    
    loadXMLDoc(baseURL + game.attributes["dir"].value);
}

gameObject = function(awayTm, homeTm, gameDir, startTime, amPm) {
    this.homeTm = homeTm;
    this.awayTm = awayTm;
    this.gameDir = gameDir;
    this.startTime = startTime;
    this.amPm = amPm;
    this.publish = function() {
        document.getElementById("games").innerHTML +=
            "<div class='game' onclick=gen(this) dir=" +
            gameDir +
            "/" +
            "><b>" +
            this.awayTm +
            "</b><span> @ </span><b>" +
            this.homeTm +
            "</b>"+ " - "+ this.startTime + " " + this.amPm +"</div>";
    };
};

function linescoreClean(){
  var y = document.getElementsByTagName("td")
  for(var i =0; i<y.length;i++){
    if(y[i].innerHTML == "undefined"){
      y[i].innerHTML = "";
    }
  }
}

var playerObject = function(flag, id, name, pos){
    this.flag=flag;
    this.id=id;
    this.name=name;
    this.pos=pos;
    
}  