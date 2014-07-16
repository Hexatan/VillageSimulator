/**
 * Created by gduvaux on 15/07/2014.
 */

var wngPlugin = new jQuery.wng();

var randRange = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function Village(){
    this.population = [];

    this.pMen = [];
    this.pWomen = [];
    this.registre = [];

    this.genocide = function(){
        while(this.population.length > 0){
            this.population.pop();
        }
        while(this.registre.length > 0){
            this.registre.pop();
        }
        savePop();
    }
}

function Human(name,age,strength,UIN){
    this.UIN = !UIN ? 0 : UIN;
    this.age = !age ? 0 : age;
    this.strength = !strength ? Math.floor((Math.random()*100)+1) : strength;
    this.name = !name ? wngPlugin.generate({}) : name;

    this.ageing = function(){
        this.age++;
    }
}

function Man(name,age,strength,UIN){
    Human.apply(this,[name,age,strength,UIN]);
}

function Woman(name,age,strength,UIN,fertility){
    Human.apply(this,[name,age,strength,UIN]);
    this.fertility = !fertility ? Math.floor((Math.random()*100)+1) : fertility;
}

function addPop(human){
    var genUIN = randRange(0,10000);
    while(village.registre.indexOf(genUIN) != -1){
        genUIN = randRange(0,10000);
    }
    human.UIN = genUIN;
    if(human instanceof Man)
        village.pMen.push(human);
    else
        village.pWomen.push(human);
    population.push(human);
    village.registre.push(human.UIN);
    savePop(human);
}

function displayPop(village){
    village.html("");
    var length = population.length;
    for(var i = 0, human;i<length;i++){
        human = population[i];
        if(human instanceof Man)
            village.append('<i id="' + human.UIN + '" class="fa fa-male person"></i>');
        else
            village.append('<i id="' + human.UIN + '" class="fa fa-female person"></i>');

    }
}

function savePop(human){
    if(!human){
        database.deleteRows("people");
    }else{
        var sex;
        if(human instanceof Man)
            sex = "M";
        else
            sex = "W";
        database.insert("people",{UIN : human.UIN, age : human.age, strength : human.strength, name : human.name, sex : sex});
    }
    database.commit();
}

function loadPop(){
    var dataPop = database.query("people");
    var length = dataPop.length;
    var pop = [];
    for(var i = 0;i<length;i++){
        var human = dataPop[i] ;
        if(human.sex === "M"){
            pop.push(new Man(human.name,human.age,human.strength,human.UIN));
        }else{
            pop.push(new Woman(human.name,human.age,human.strength,human.UIN));
        }
        village.registre.push(human.UIN);
    }
    return pop;
}


function createSave(){
    var dataBase = new localStorageDB("VillageSimulator",localStorage);

    if(dataBase.isNew()){
        dataBase.createTable("people",["UIN","age","strength","name","sex"]);
        dataBase.commit();
    }
    return dataBase;
}

/*
 Main
 */
var database = createSave();
var village = new Village();
village.population = loadPop();
var population = village.population;


jQuery(document).ready(function($){

    displayPop($("#village"));

    $("#addMen").click(function(){
        addPop(new Man());
        displayPop($("#village"));
        //console.log(village.population);
    });
    $("#addWomen").click(function(){
        addPop(new Woman());
        displayPop($("#village"));
        //console.log(population);
    });
    $("#genocide").click(function(){
        village.genocide();
        displayPop($("#village"));
    });
    $("#nuke").click(function(){
        village.genocide();
        displayPop($("#village"));
    });
    $(".person").click(function(){

    });
});
