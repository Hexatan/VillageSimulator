/**
 * Created by gduvaux on 15/07/2014.
 */

var randRange = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function Village(){

    this.name = wngPlugin.generate({});
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

function displayPop(){
    var length = population.length;
    var human = population[length-1];
    if(length > 0){
        if(human instanceof Man)
            divVillage.append('<i id="' + human.UIN + '" class="fa fa-male person"></i>');
        else
            divVillage.append('<i id="' + human.UIN + '" class="fa fa-female person"></i>');
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
    for(var i = 0;i<length;i++){
        var human = dataPop[i] ;
        if(human.sex === "M"){
            population.push(new Man(human.name,human.age,human.strength,human.UIN));
        }else{
            population.push(new Woman(human.name,human.age,human.strength,human.UIN));
        }
        village.registre.push(human.UIN);
        displayPop();
    }
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
var wngPlugin = new jQuery.wng();
var divVillage = null;
var database = createSave();
var village = new Village();
var population = village.population;


jQuery(document).ready(function($){
    divVillage = $("#village");

    loadPop();

    var godMode = false;
    var humanShowed = null;

    $("#addMen").click(function(){
        addPop(new Man());
        displayPop();
        //console.log(village.population);
    });
    $("#addWomen").click(function(){
        addPop(new Woman());
        displayPop();
        //console.log(population);
    });
    $("#genocide").click(function(){
        village.genocide();
        divVillage.html("");
    });
    $("#nuke").click(function(){
        village.genocide();
        divVillage.html("");
    });
    $("#god").click(function(){
        if(!godMode){
            $("input.val").prop({disabled : false});
            godMode = true;
        }else{
            $("input.val").prop({disabled : true});
            godMode = false;
        }
    });
    $(".person").click(function(){
        var UIN = this.id, i = 0, human;
        while(!human){
            human = population[i].UIN == UIN ? population[i] : undefined ;
            i++;
        }
        humanShowed = human;
        $("input#name").val(human.name);
        $("input#age").val(human.age);
        $("input#strength").val(human.strength);
    });
    $("input.val").change(function(){
        var i = population.indexOf(humanShowed);
        var id = this.id;
        switch (id){
            case "age":
                population[i].age = this.value;
                break;
            case "strength":
                population[i].strength = this.value;
                break;
            case "name":
                population[i].name = this.value;
                break;
        }
    });
    $("button").click(function(){
        $("input#population").val(village.population.length);
    });
    $("input#nameV").val(village.name);
    $("input#population").val(village.population.length);
});
