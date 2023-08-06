//layer 1 will be updated every frame
var layer1 = document.getElementById('layer1');

layer1.width = 780;//0.98* window.innerWidth;
layer1.height = 600;

var c = layer1.getContext('2d');

//layer 2 will be updated every generation and will overlay layer 1
var layer2 = document.getElementById('layer2');

layer2.width = 780// 0.98* window.innerWidth;
layer2.height = 600; //0.70 * window.innerHeight;

var c2 = layer2.getContext('2d');

//layer 3 will be updated every generation and will have the plots, below layers 1 and 2
var layer3 = document.getElementById('layer3');

layer3.width = 780;//0.98* window.innerWidth;
layer3.height = 300;//0.3* window.innerHeight;

var c3 = layer3.getContext('2d');

// style variables
var frame_col = "rgba(148,148,148,1)"

var colorArray = [
    "rgba(213,94,0,0.7)",
    "rgba(0,114,178,0.7)",
    "rgba(240,228,66,0.7)",
    "rgba(230,159,0,0.7)",
    "rgba(0,158,115,0.7)"
]

//define execution variables
var or_speed = 0.2;
var speed = or_speed;
var circleArray = [];
var gen1Array=[];
var genPrevArray=[];

//I'm using center_x so I can shift the frames a bit to the right to fit in the 780 px of the iframe
var center_x = 0.575*layer1.width 

var frame_radius = 0.5*layer1.width/2;
var circle_radius = 0.05*frame_radius;
var pop_size;

var generation = 1;

var pA = [] // allele frequency p(A)
var pa = []

var gAA = [] // genotype frequency g(AA)   
var gAa = []
var gaa = []

var sAA //survivability
var sAa
var saa

var nAA = [] //number of individuals AA
var nAa = []
var naa = []

var AA_Array
var Aa_array
var aa_array

var deadAA
var deadAa 
var deadaa

var dominant = false

//variables controlling animation
var death_done = false
var animating = false
var fps = 60
var frame_time
var calculating = false

//mouse variables
var mouse = {
    x: undefined,
    y: undefined
}

var clicked = false

// mouse controls
window.addEventListener('mousedown', e => {
    clicked = true;
})

window.addEventListener('mouseup', e => {
    clicked = false;
})

window.addEventListener("mousemove", function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
})

//CHANGES TO INPUT BOXES
// one for each input, to update values in real time
pA_form = document.getElementById("pA")
pa_form = document.getElementById("pa")
allele_slide = document.getElementById("allele_slide")

pA_form.addEventListener("change", function(){
    
    pa_form.value = (1 - pA_form.value).toFixed(2)
    document.getElementById("pAA").textContent = (pA_form.value * pA_form.value).toFixed(3)
    document.getElementById("pAa").textContent = (2*pA_form.value * pa_form.value).toFixed(3)
    document.getElementById("paa").textContent = (pa_form.value * pa_form.value).toFixed(3)

    allele_slide.value = pA_form.value
    
    var value = pA_form.value*100
    allele_slide.style.background = "linear-gradient(to right, #D55E00 0%, #D55E00 " + value + "%, #fff " + value + "%, #fff 100%)"
})

pa_form.addEventListener("change", function(){
    
    pA_form.value = (1 - pa_form.value).toFixed(2)
    document.getElementById("pAA").textContent = (pA_form.value * pA_form.value).toFixed(3)
    document.getElementById("pAa").textContent = (2*pA_form.value * pa_form.value).toFixed(3)
    document.getElementById("paa").textContent = (pa_form.value * pa_form.value).toFixed(3)

    allele_slide.value = pA_form.value
    
    var value = pA_form.value*100
    allele_slide.style.background = "linear-gradient(to right, #D55E00 0%, #D55E00 " + value + "%, #fff " + value + "%, #fff 100%)"
})

allele_slide.oninput = function(){
    pA_form.value = this.value
    pa_form.value = (1 - pA_form.value).toFixed(2)
    
    if(dominant ==false){
        document.getElementById("pAA").textContent = (pA_form.value * pA_form.value).toFixed(3)
        document.getElementById("pAa").textContent = (2*pA_form.value * pa_form.value).toFixed(3)
    }
    else{
        document.getElementById("pAA").textContent = (pA_form.value * pA_form.value + (2*pA_form.value * pa_form.value)).toFixed(3)
    }
    
    document.getElementById("paa").textContent = (pa_form.value * pa_form.value).toFixed(3)

    var value = pA_form.value*100
    this.style.background = "linear-gradient(to right, #D55E00 0%, #D55E00 " + value + "%, #fff " + value + "%, #fff 100%)"
}

sAA_form = document.getElementById("sAA")
sAa_form = document.getElementById("sAa")
saa_form = document.getElementById("saa")

sAA_slide = document.getElementById("sAA_slide")
sAa_slide = document.getElementById("sAa_slide")
saa_slide = document.getElementById("saa_slide")

sAA_form.addEventListener("change",function(){
    sAA_slide.value = sAA_form.value 
    var value = sAA_form.value*100
    sAA_slide.style.background = "linear-gradient(to right, #D55E00 0%, #D55E00 " + value + "%, #fff " + value + "%, #fff 100%)"
})

sAa_form.addEventListener("change",function(){
    sAa_slide.value = sAa_form.value
    var value = sAa_form.value*100
    sAa_slide.style.background = "linear-gradient(to right, #D55E00 0%, #D55E00 " + value + "%, #fff " + value + "%, #fff 100%)" 
})

saa_form.addEventListener("change",function(){
    saa_slide.value = saa_form.value 
    var value = saa_form.value*100
    saa_slide.style.background = "linear-gradient(to right, #D55E00 0%, #D55E00 " + value + "%, #fff " + value + "%, #fff 100%)"
})

sAA_slide.oninput = function(){
    sAA_form.value = this.value
    
    var value = sAA_form.value*100
    this.style.background = "linear-gradient(to right, #D55E00 0%, #D55E00 " + value + "%, #fff " + value + "%, #fff 100%)"
}

sAa_slide.oninput = function(){
    sAa_form.value = this.value
    
    var value = sAa_form.value*100
    this.style.background = "linear-gradient(to right, #D55E00 0%, #D55E00 " + value + "%, #fff " + value + "%, #fff 100%)"
}

saa_slide.oninput = function(){
    saa_form.value = this.value
    
    var value = saa_form.value*100
    this.style.background = "linear-gradient(to right, #D55E00 0%, #D55E00 " + value + "%, #fff " + value + "%, #fff 100%)"
}

dom_yes = document.getElementById("yes")
dom_no = document.getElementById("no")

dom_yes.addEventListener("change", function(){
    dominant = true
    
    document.getElementById("Atxt").textContent = "A "
    document.getElementById("atxt").textContent = " a"
    
    document.getElementById("AAtxt").textContent = "A-: "
    //document.getElementById("Aatxt").textContent = "Aa: "
    document.getElementById("aatxt").textContent = "aa: "

    sAa_form.hidden = true
    sAa_slide.hidden = true
    
    document.getElementById("Aatxt").hidden = true
    document.getElementById("pAa").hidden = true
    document.getElementById("pAA").textContent = (pA_form.value * pA_form.value + (2*pA_form.value * pa_form.value)).toFixed(3)
})

dom_no.addEventListener("change", function(){
    dominant = false
    
    document.getElementById("Atxt").innerHTML = "A<sub>1</sub> "
    document.getElementById("atxt").innerHTML = " A<sub>2</sub>"

    document.getElementById("AAtxt").innerHTML = "A<sub>1</sub>A<sub>1</sub>: "
    document.getElementById("Aatxt").innerHTML = "A<sub>1</sub>A<sub>2</sub>: "
    document.getElementById("aatxt").innerHTML = "A<sub>2</sub>A<sub>2</sub>: "
    
    sAa_form.hidden = false
    sAa_slide.hidden = false

    document.getElementById("Aatxt").hidden = false
    document.getElementById("pAa").hidden = false

    document.getElementById("pAA").textContent = (pA_form.value * pA_form.value).toFixed(3)
    document.getElementById("pAa").textContent = (2*pA_form.value * pa_form.value).toFixed(3)
})

//load data
function load_data(){
    pA = []
    pa = []

    gAA = []
    gAa = []
    gaa = [] 

    nAA = []
    nAa = []
    naa = []
            
    pA.push(parseFloat(pA_form.value))
    pa.push(parseFloat(pa_form.value))
    gAA.push(parseFloat(pA_form.value*pA_form.value))
    gAa.push(parseFloat(2*pA_form.value*pa_form.value))
    gaa.push(parseFloat(pa_form.value*pa_form.value))

    sAA = parseFloat(sAA_form.value)
    sAa = parseFloat(sAa_form.value)
    saa = parseFloat(saa_form.value)

    nAA.push(Math.round(gAA[0] * pop_size))
    
    naa.push(Math.round(gaa[0] * pop_size))

    //heterozigotes are where we round up or down
    nAa.push(pop_size-nAA[0]-naa[0])

    indexArray = []

    for(var i = 0; i<pop_size;i++){
        indexArray.push(i)
    }

    AA_Array = []
    Aa_Array = []
    // the ~~ truncates floats into integers
    for(var i = 0;i<nAA[0];i++){
        index = ~~(Math.random()*indexArray.length)

        AA_Array.push(indexArray[index])
        indexArray.splice(index,1)
    }

    for(var i = 0;i<nAa[0];i++){
        index = ~~(Math.random()*indexArray.length)

        Aa_Array.push(indexArray[index])
        indexArray.splice(index,1)
    }

    aa_Array = indexArray
}

//create frame
function Circle_frame(){
    radius = frame_radius

    c.beginPath();
    c.strokeStyle = frame_col
    c.lineWidth = 3
    c.arc(center_x, layer1.height/2, radius, 0, 2 * Math.PI, false);
    c.stroke();
}

// EVENTS FOR BUTTONS CONTROLLING THE SIMULATIONS

run_btn = document.getElementById('run_btn')

run_btn.addEventListener("click", function(){
    pop_size  = document.getElementById("pop").value
    
    generation = 1

    speed = or_speed

    load_data();
    
    init();

    frame_time = Date.now()
    if(animating==false){
        animate();
        animating = true
    }
})

next_gen_btn = document.getElementById('next_gen')

//run the changes between generation
next_gen_btn.addEventListener("click", function(){
    //This fucntion will select which circles are going to die. The death information is passed to the circles objects. Once the circles are finished dying, 
    //they update death_done, which calls the next_gen function inside the animation frame.

    //this conditional is added to make sure calculations are finished before the button is active to the user again
    //the simulation was crashing if the button were clicked to quickly before this.
    if(calculating == false){

        calculating = true

        deadAA = Math.round((1-sAA)*nAA[generation-1])

        if(dominant){
            deadAa = Math.round((1-sAA)*nAa[generation-1])
        } else{
            deadAa = Math.round((1-sAa)*nAa[generation-1])
        }

        deadaa = Math.round((1-saa)*naa[generation-1])
            
        //stop movement
        speed = 0
        
        liveAA_array = AA_Array
        liveAa_array = Aa_Array
        liveaa_array = aa_Array

        // only update if allele is not fixed
        if(pA[generation-1]!=0 & pa[generation-1]!=0){
            // the ~~ truncates floats into integers
            for(var i = 0; i<deadAA;i++){
                index = ~~(Math.random()*liveAA_array.length)
                liveAA_array.splice(index,1)
            }
            
            for(var i = 0; i<deadAa;i++){
                index = ~~(Math.random()*liveAa_array.length)
                liveAa_array.splice(index,1)
            }
            
            for(var i = 0; i<deadaa;i++){
                index = ~~(Math.random()*liveaa_array.length)
                liveaa_array.splice(index,1)
            }

            for(var i = 0;i<circleArray.length;i++){

                if(liveAA_array.includes(i) | liveAa_array.includes(i) | liveaa_array.includes(i)){
                    circleArray[i].death = false
                } else{
                    circleArray[i].death = true
                }
            }

        }else{
            for(var i = 0;i<circleArray.length;i++){
                circleArray[i].death = false
                death_done = true
            }
        }
        
    }
})



//to run at start
Circle_frame()

//create the individual object and behavior
function Circle(id, x, y, angle, radius, fill_color, death, growing) {
    this.id = id
    this.x = x;
    this.y = y;
    this.fill_color = fill_color;
    this.angle = angle;
    this.radius = radius;
    this.death = death
    this.growing = growing
    var radius_factor = 0;

    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius * radius_factor, 0, 2 * Math.PI, false);
        c.fillStyle = fill_color;
        c.fill();
    }

    //update the position of individuals
    this.update = function () {
        //first test if circles are touching frame. If so, change their angles.
        if(Math.pow(this.x - center_x,2)+Math.pow(this.y-layer1.height/2,2)>Math.pow(frame_radius-radius,2)){
            
            dx = center_x - this.x
            dy = layer1.height/2 - this.y 
            
            angle_vector = Math.atan2(dy,dx)
            this.angle = Math.random()* (Math.PI *(2/3)) + (angle_vector - Math.PI/3)
        }
        
        //death
        if(this.death == true & radius_factor>0){
            
            radius_factor -=0.05;

            if(radius_factor<=0){
                radius_factor = 0
                death_done = true
            }
        }

        //growth
        if(this.growing){
            radius_factor +=0.05

            if(radius_factor>=1){
                radius_factor = 1
                this.growing = false
            }
        }

        if(this.growing == false){
            this.x += Math.cos(this.angle)*speed;
            this.y += Math.sin(this.angle)*speed;
        }
        
        this.draw();
    }
}

//object to store information of circles position and location for detail plots
function Circle_record(Circle){
    this.id = Circle.id
    this.x = Circle.x
    this.y = Circle.y
    this.color = Circle.fill_color
}

function new_gen(){
    
    //so this run only once
    death_done = false
    
    //store data for previous plot record
    if(generation==1){
        gen1Array =[]
        for(var i=0;i<circleArray.length;i++){
            gen1Array.push(new Circle_record(circleArray[i]))
        }

    }else{
        genPrevArray = []
        for(var i=0;i<circleArray.length;i++){
            genPrevArray.push(new Circle_record(circleArray[i]))
        }
    }
    //clear circles array
    if(pA[pA.length-1]!=0 & pa[pa.length-1]!=0){
        for(var i = circleArray.length-1;i>=0;i--){
            if(liveAA_array.includes(i) | liveAa_array.includes(i) | liveaa_array.includes(i)){
            } else{
                circleArray.splice(i,1)
            }     
        }       
    }

    //update arrays 
    //the conditional is to make sure when an allele is fized, the simulations does not crash

    if(pA[pA.length-1]==0 | pa[pa.length-1]==0){
        
        pA.push(pA[generation-1])
        pa.push(pa[generation-1])

        gAA.push(gAA[generation-1])
        gAa.push(gAa[generation-1])
        gaa.push(gaa[generation-1])

        nAA.push(nAA[generation-1])
        naa.push(nAa[generation-1])
        nAa.push(naa[generation-1])
    }else{
        pA.push((2*liveAA_array.length+liveAa_array.length)/(2*(liveAA_array.length+liveAa_array.length+liveaa_array.length)))
        pa.push((2*liveaa_array.length+liveAa_array.length)/(2*(liveAA_array.length+liveAa_array.length+liveaa_array.length)))

        gAA.push(Math.pow(pA[generation],2))
        gAa.push(2*pA[generation]*pa[generation])
        gaa.push(Math.pow(pa[generation],2))

        nAA.push(Math.round(gAA[generation] * pop_size))
        naa.push(Math.round(gaa[generation] * pop_size))
        nAa.push(Math.round(pop_size-nAA[generation]-naa[generation]))

    }
    
    //repopulate (only if allele is not fixed)

    if(pA[pA.length-1]!=0 & pa[pa.length-1]!=0){
        radius = circle_radius
        for(var i=0; i<nAA[generation]-liveAA_array.length;i++){
            var x = Math.random() * (2*frame_radius - 2 * radius) + (center_x-frame_radius) + radius;
            var y = Math.random() * (2*frame_radius - 2 * radius) + (center_x-frame_radius) + radius;
                        
            while (Math.pow(x - center_x,2)+Math.pow(y-layer1.height/2,2)>Math.pow(frame_radius-radius,2)){
                x = Math.random() * (2*frame_radius - 2 * radius) + (center_x-frame_radius) + radius;
                y = Math.random() * (2*frame_radius - 2 * radius) + (layer1.height/2-frame_radius) + radius;
            }

            var angle = Math.random() * (2*Math.PI)

            var color = colorArray[0];
            var id = "AA"
            circleArray.push(new Circle(id, x, y, angle, radius, color, false, true));
        }

        for(var i=0; i<nAa[generation]-liveAa_array.length;i++){
            var x = Math.random() * (2*frame_radius - 2 * radius) + (center_x-frame_radius) + radius;
            var y = Math.random() * (2*frame_radius - 2 * radius) + (layer1.height/2-frame_radius) + radius;
                        
            while (Math.pow(x - center_x,2)+Math.pow(y-layer1.height/2,2)>Math.pow(frame_radius-radius,2)){
                x = Math.random() * (2*frame_radius - 2 * radius) + (center_x-frame_radius) + radius;
                y = Math.random() * (2*frame_radius - 2 * radius) + (layer1.height/2-frame_radius) + radius;
            }

            var angle = Math.random() * (2*Math.PI)
            if(dominant){
                var color = colorArray[0];
            }else{
                var color = colorArray[1];
            }
            
            var id = "Aa"
            circleArray.push(new Circle(id, x, y, angle, radius, color, false, true));
        }

        for(var i=0; i<naa[generation]-liveaa_array.length;i++){
            var x = Math.random() * (2*frame_radius - 2 * radius) + (center_x-frame_radius) + radius;
            var y = Math.random() * (2*frame_radius - 2 * radius) + (layer1.height/2-frame_radius) + radius;
                        
            while (Math.pow(x - center_x,2)+Math.pow(y-layer1.height/2,2)>Math.pow(frame_radius-radius,2)){
                x = Math.random() * (2*frame_radius - 2 * radius) + (center_x-frame_radius) + radius;
                y = Math.random() * (2*frame_radius - 2 * radius) + (layer1.height/2-frame_radius) + radius;
            }

            var angle = Math.random() * (2*Math.PI)
            var color = colorArray[2];
            var id = "aa"
            circleArray.push(new Circle(id, x, y, angle, radius, color, false, true));
        }
        
    }
    
    AA_Array=[]
    Aa_Array=[]
    aa_Array=[]
    
    for(var i=0;i<circleArray.length;i++){
        if(circleArray[i].id=="AA"){
            AA_Array.push(i)
        }
            
        if(circleArray[i].id=="Aa"){
            Aa_Array.push(i)
        }
            
        if(circleArray[i].id=="aa"){
            aa_Array.push(i)            
        }
    }
    
    //update generation
    generation+=1
    
    //redraw info box
    draw_l2()
    draw_l3()
    speed = or_speed
    calculating = false

}

function init() {
    //draw circle frame
    Circle_frame()

    //draw layer 2
    draw_l2()

    //draw layer 3
    draw_l3()
    
    //Generate points
    circleArray = [];
    
    for (var i = 0; i < pop_size; i++) {
        var radius = circle_radius;
        
        var x = Math.random() * (2*frame_radius - 2 * radius) + (center_x-frame_radius) + radius;
        var y = Math.random() * (2*frame_radius - 2 * radius) + (layer1.height/2-frame_radius) + radius;
             
        while (Math.pow(x - center_x,2)+Math.pow(y-layer1.height/2,2)>Math.pow(frame_radius-radius,2)){
            x = Math.random() * (2*frame_radius - 2 * radius) + (center_x-frame_radius) + radius;
            y = Math.random() * (2*frame_radius - 2 * radius) + (layer1.height/2-frame_radius) + radius;
        }

        var angle = Math.random() * (2*Math.PI)

        //var color = "rgba(0,0,255,1)"
        if(AA_Array.includes(i)){
            var color = colorArray[0];
            var id = "AA"
        }else if(Aa_Array.includes(i)){
            var id = "Aa"
            if(dominant){
                var color = colorArray[0];
            }else{
                var color = colorArray[1];
            }
        }else{
            var id = "aa"
            var color = colorArray[2];
        }
        
        //var color = colorArray[Math.floor(Math.random() * colorArray.length)];
        circleArray.push(new Circle(id, x, y, angle, radius, color, false, true));
    }
   
//animation controls
}
function animate() {
    requestAnimationFrame(animate);
    
    c.clearRect(0, 0, layer1.width, layer1.height);

    Circle_frame()

    for (var i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }

    if(death_done){
        new_gen()
    }
}

// Layer 2 drawing
function draw_l2(){
    //how many pixels 1 vw and vh uses
    vw2px = layer1.width/100
    vh2px = layer1.height/100

    c2.clearRect(0, 0, layer2.width, layer2.height);
    //add general title
    c2.textAlign = "center";
    c2.textBaseline = "top";
    c2.font = "bold " + Math.round(8*vh2px)+"px Verdana";
    c2.fillStyle = "black";
    c2.fillText("GENERATION " + generation,center_x,0)

    //draw info box
    var x_max = (center_x-frame_radius) * 0.95;
    var x_min = x_max-40*vh2px

    //12 lines in the box, each line 5 *vh
    var y_min = layer2.height/2 - 25*vh2px
    var y_max = layer2.height/2 + 25*vh2px 
    var corner = (x_max-x_min)*0.05
    c2.fillStyle = frame_col;
    c2.beginPath()
    c2.moveTo(x_min,y_min+corner)
    c2.arc(x_min+corner,y_min+corner,corner,Math.PI,Math.PI*1.5)
    c2.lineTo(x_max-corner,y_min)
    c2.arc(x_max-corner,y_min+corner,corner,Math.PI*1.5,0)
    c2.lineTo(x_max,y_max-corner)
    c2.arc(x_max-corner,y_max-corner,corner,0,Math.PI/2)
    c2.lineTo(x_min+corner,y_max)
    c2.arc(x_min+corner,y_max-corner,corner,Math.PI/2,Math.PI)
    c2.closePath() 
    c2.fill()

    //text on info_box
    c2.textAlign = "center";
    c2.textBaseline = "top";
    c2.font = "bold " + Math.round(3*vh2px)+"px Verdana";
    c2.fillStyle = "black";
    c2.fillText("Population Info:",(x_max-x_min)/2+x_min,y_min+corner)

    //12 lines in the box
    //first line after title starts on line 2
    var line_h = (y_max-y_min - 2*corner)/12
    var line_1 = y_min+corner+line_h

    c2.font = Math.round(3*vh2px)+"px Verdana";
    c2.textAlign = "left";
    
    c2.fillText("Individuals:",x_min+corner, line_1)
    
    var percAA = Math.round(nAA[generation-1]/(nAA[generation-1]+nAa[generation-1]+naa[generation-1])*1000)/10
    var percAa = Math.round(nAa[generation-1]/(nAA[generation-1]+nAa[generation-1]+naa[generation-1])*1000)/10
    var percaa = Math.round(naa[generation-1]/(nAA[generation-1]+nAa[generation-1]+naa[generation-1])*1000)/10
    
    c2.font = Math.round(2.5*vh2px)+"px Verdana";
    if(dominant){
        c2.fillText(": " + (nAA[generation-1]+nAa[generation-1]) + " (" + (percAA+percAa) + "%)",x_min+2*corner+line_h, line_1+line_h)
        c2.fillText(": " + naa[generation-1] + " (" + percaa + "%)",x_min+2*corner+line_h, line_1+2*line_h)
    }else{
        c2.fillText(": " + nAA[generation-1]+ " (" + percAA + "%)",x_min+2*corner+line_h, line_1+line_h)
        c2.fillText(": " + nAa[generation-1]+ " (" + percAa + "%)",x_min+2*corner+line_h, line_1+2*line_h)
    }
    
    if(dominant==false){
        c2.fillText(": " + naa[generation-1]+ " (" + percaa + "%)",x_min+2*corner+line_h, line_1+3*line_h)
    }
    
    c2.font = Math.round(3*vh2px)+"px Verdana";
    c2.fillText("Allelles:",x_min+corner, line_1+4*line_h)
    
    var freqA = 2* nAA[generation-1]+nAa[generation-1]
    var freqa = 2* naa[generation-1]+nAa[generation-1]
    var percA = Math.round(freqA/(freqA+freqa)*1000)/10
    var perca = Math.round(freqa/(freqA+freqa)*1000)/10

    c2.font = Math.round(2.5*vh2px)+"px Verdana";
    c2.fillText("Allele A: " + freqA + " (" + percA + "%)",x_min+2*corner, line_1+5*line_h)
    c2.fillText("Allele a: "+ freqa + " (" + perca + "%)",x_min+2*corner, line_1+6*line_h)
    
    c2.font = Math.round(3*vh2px)+"px Verdana";
    c2.fillText("Genotype:",x_min+corner, line_1 + 7*line_h)
          
    c2.font = Math.round(2.5*vh2px)+"px Verdana";
    c2.fillText("Genotype AA: "+ nAA[generation-1] + " (" + percAA + "%)",x_min+2*corner, line_1+8*line_h)
    c2.fillText("Genotype Aa: "+ nAa[generation-1] + " (" + percAa + "%)",x_min+2*corner, line_1+9*line_h)
    c2.fillText("Genotype aa: "+ naa[generation-1] + " (" + percaa + "%)",x_min+2*corner, line_1+10*line_h)

    //circles in the info box
    //White circle first to not affect transparency 
    c2.fillStyle = "white"
    c2.beginPath();
    c2.arc(x_min+2*corner+line_h/2,line_1+1.25*line_h,0.45*line_h,0,Math.PI*2)
    c2.fill()

    c2.beginPath();
    c2.arc(x_min+2*corner+line_h/2,line_1+2.25*line_h,0.45*line_h,0,Math.PI*2)
    c2.fill()
    
    if(dominant==false){
        c2.beginPath();
        c2.arc(x_min+2*corner+line_h/2,line_1+3.25*line_h,0.45*line_h,0,Math.PI*2)
        c2.fill()
    }
    
    //now the colors
    c2.fillStyle = colorArray[0]
    c2.beginPath();
    c2.arc(x_min+2*corner+line_h/2,line_1+1.25*line_h,0.45*line_h,0,Math.PI*2)
    c2.fill()

    if(dominant){
        c2.fillStyle = colorArray[2]
    }else{
        c2.fillStyle = colorArray[1]
    }
    
    c2.beginPath();
    c2.arc(x_min+2*corner+line_h/2,line_1+2.25*line_h,0.45*line_h,0,Math.PI*2)
    c2.fill()

    if(dominant==false){
        c2.fillStyle = colorArray[2]

        c2.beginPath();
        c2.arc(x_min+2*corner+line_h/2,line_1+3.25*line_h,0.45*line_h,0,Math.PI*2)
        c2.fill()
    }

    //Draw detail circles of previous generations:
    if(generation>1){
        d1_r = frame_radius/2.5
        d1_x = 0.95*center_x+frame_radius + d1_r;
        d1_y = layer2.height/4

        c2.beginPath();
        c2.strokeStyle = frame_col
        c2.lineWidth = 2
        c2.arc(d1_x, d1_y, d1_r, 0, 2 * Math.PI, false);
        c2.stroke();

        c2.textAlign = "center";
        c2.textBaseline = "top";
        c2.font = Math.round(3*vh2px)+"px Verdana";
        c2.fillStyle = "black";
        
        c2.fillText("Generation 1", d1_x, d1_y+1.05*d1_r)

        //draw tiny circles
        d1_ind_radius = 0.05*d1_r;
        scale = d1_r/frame_radius

        for(var i=0;i<gen1Array.length;i++){
            c2.beginPath();
            c2.arc((gen1Array[i].x-(center_x-frame_radius))*scale+d1_x-d1_r, (gen1Array[i].y-(layer1.height/2-frame_radius))*scale+d1_y-d1_r, d1_ind_radius, 0, 2 * Math.PI, false);
            c2.fillStyle =gen1Array[i].color;
            c2.fill();
        }
    }

    if(generation>2){
        d2_r = d1_r
        d2_x = 0.95*center_x+frame_radius + d2_r;
        d2_y = layer2.height*0.75

        c2.beginPath();
        c2.strokeStyle = frame_col
        c2.lineWidth = 2
        c2.arc(d2_x, d2_y, d2_r, 0, 2 * Math.PI, false);
        c2.stroke();

        c2.textAlign = "center";
        c2.textBaseline = "top";
        c2.font = Math.round(3*vh2px)+"px Verdana";
        c2.fillStyle = "black";
        
        c2.fillText("Generation "+(generation-1), d2_x, d2_y+1.05*d2_r)

        //draw tiny circles
        d2_ind_radius = d1_ind_radius;
        scale = d2_r/frame_radius

        for(var i=0;i<genPrevArray.length;i++){
            c2.beginPath();
            c2.arc((genPrevArray[i].x-(center_x-frame_radius))*scale+d2_x-d2_r, (genPrevArray[i].y-(layer1.height/2-frame_radius))*scale+d2_y-d2_r, d2_ind_radius, 0, 2 * Math.PI, false);
            c2.fillStyle =genPrevArray[i].color;
            c2.fill();
        }
    }
}

//Layer 3 - the plots
//it will appear below the animated circles
function draw_l3(){
    c3.clearRect(0, 0, layer3.width, layer3.height);
    
    //there will be two plots, first one bar plot of alleles, to the left, second, line plot of genotypes to the right
    xmin_p1 = 0.1* layer3.width
    xmax_p1 = 0.45* layer3.width

    xmin_p2 = 0.55*layer3.width
    xmax_p2 = 0.9* layer3.width

    if (generation <=10){
        max_val_x = 10
        x_step =  (xmax_p1-xmin_p1)/10  
    } else {
        max_val_x = generation
        x_step =  (xmax_p1-xmin_p1)/generation
    }
    
    ymax = 0.1*layer3.height
    ymin = 0.85*layer3.height

    y_step = (ymin-ymax)/100

    //text sizes
    vh2px= layer3.height/100

    //text size for x axis, in case we need to fit more labels in the bottom
    if(generation <=15){
        vh2px_x = layer3.height/100
    } else{
        vh2px_x = layer3.height/125
    }

    //draw plot 1
    //plot bars first, so axis cover them
    for(var i=0;i<=generation;i++){
        c3.fillStyle = colorArray[0]
        c3.beginPath();
        c3.moveTo(xmin_p1+i*x_step,ymin)
        c3.lineTo(xmin_p1+(i+1)*x_step,ymin)
        c3.lineTo(xmin_p1+(i+1)*x_step,ymin-pA[i]*y_step*100)
        c3.lineTo(xmin_p1+i*x_step,ymin-pA[i]*y_step*100)
        c3.closePath()
        c3.fill()

        c3.fillStyle = colorArray[2]
        c3.beginPath();
        c3.moveTo(xmin_p1+i*x_step,ymin-pA[i]*y_step*100)
        c3.lineTo(xmin_p1+(i+1)*x_step,ymin-pA[i]*y_step*100)
        c3.lineTo(xmin_p1+(i+1)*x_step,ymax)
        c3.lineTo(xmin_p1+i*x_step,ymax)
        c3.closePath()
        c3.fill()
    }

    //axis now
    c3.strokeStyle = frame_col
    c3.lineWidth = 3
    c3.lineCap = "round"
    c3.beginPath()
    c3.moveTo(xmin_p1,ymax)
    c3.lineTo(xmin_p1,ymin)
    c3.lineTo(xmax_p1,ymin)
    c3.stroke();
    c3.textAlign = "center";
    c3.textBaseline = "top";
    c3.font = Math.round(4*vh2px_x)+"px Verdana";
    c3.fillStyle = "black";

    for(var i=1;i<=max_val_x;i++){
       c3.fillText(i, xmin_p1 + 0.5*x_step + (i-1)*x_step, ymin + 1.5*vh2px)
    }

    c3.font = Math.round(5*vh2px)+"px Verdana";
    c3.fillText("Generation", (xmin_p1 + xmax_p1)/2, ymin + 7* vh2px)
    c3.textAlign = "right";
    c3.textBaseline = "middle";
    c3.font = Math.round(4*vh2px)+"px Verdana";
    c3.fillStyle = "black";

    for(var i=0;i<=5;i++){
         c3.fillText(i*2/10, xmin_p1 - 1.5*1.5*vh2px, ymin - i*20*y_step)
    }

    //draw plot 2
    //line + dots first
    for(var i=0;i<=generation;i++){
        // dots first
        // aa circles (don't change depending on allele dominance)
        c3.fillStyle = colorArray[2];
        c3.beginPath();
        c3.arc(xmin_p2+i*x_step+x_step/2, ymin-naa[i]/pop_size*100*y_step, 2*vh2px, 0, 2 * Math.PI, false);
        c3.fill();
        
        if(dominant){
            //AA + Aa data
            c3.fillStyle = colorArray[0];
            c3.beginPath();
            c3.arc(xmin_p2+i*x_step+x_step/2, ymin-(nAA[i]+nAa[i])/pop_size*100*y_step, 2*vh2px, 0, 2 * Math.PI, false);
            c3.fill();

        } else{
            //AA data
            c3.fillStyle = colorArray[0];
            c3.beginPath();
            c3.arc(xmin_p2+i*x_step+x_step/2, ymin-nAA[i]/pop_size*100*y_step, 2*vh2px, 0, 2 * Math.PI, false);
            c3.fill();

            //Aa data
            c3.fillStyle = colorArray[1];
            c3.beginPath();
            c3.arc(xmin_p2+i*x_step+x_step/2, ymin-nAa[i]/pop_size*100*y_step, 2*vh2px, 0, 2 * Math.PI, false);
            c3.fill();
        }

        //lines now
        if(generation>1){
            //aa data first (dont change depending on dominance)
            c3.strokeStyle = colorArray[2]
            c3.lineWidth = 2
            c3.beginPath()
            c3.moveTo(xmin_p2+(i-1)*x_step+x_step/2, ymin-naa[i-1]/pop_size*100*y_step)
            c3.lineTo(xmin_p2+i*x_step+x_step/2, ymin-naa[i]/pop_size*100*y_step)
            c3.stroke();

            if(dominant == true){
                //AA + Aa data
                c3.strokeStyle = colorArray[0]
                c3.lineWidth = 2
                c3.beginPath()
                c3.moveTo(xmin_p2+(i-1)*x_step+x_step/2, ymin-(nAA[i-1]+nAa[i-1])/pop_size*100*y_step)
                c3.lineTo(xmin_p2+i*x_step+x_step/2, ymin-(nAA[i]+nAa[i])/pop_size*100*y_step)
                c3.stroke();
            }else{
                //AA data
                c3.strokeStyle = colorArray[0]
                c3.lineWidth = 2
                c3.beginPath()
                c3.moveTo(xmin_p2+(i-1)*x_step+x_step/2, ymin-nAA[i-1]/pop_size*100*y_step)
                c3.lineTo(xmin_p2+i*x_step+x_step/2, ymin-nAA[i]/pop_size*100*y_step)
                c3.stroke();
                
                //Aa data
                c3.strokeStyle = colorArray[1]
                c3.lineWidth = 2
                c3.beginPath()
                c3.moveTo(xmin_p2+(i-1)*x_step+x_step/2, ymin-nAa[i-1]/pop_size*100*y_step)
                c3.lineTo(xmin_p2+i*x_step+x_step/2, ymin-nAa[i]/pop_size*100*y_step)
                c3.stroke();
            }
        }
    }

    //axis now
    c3.strokeStyle = frame_col
    c3.lineWidth = 3
    c3.lineCap = "round"
    c3.beginPath()
    c3.moveTo(xmin_p2,ymax)
    c3.lineTo(xmin_p2,ymin)
    c3.lineTo(xmax_p2,ymin)
    c3.stroke();

    c3.textAlign = "center";
    c3.textBaseline = "top";
    c3.font = Math.round(4*vh2px_x)+"px Verdana";
    c3.fillStyle = "black";

    for(var i=1;i<=max_val_x;i++){
        c3.fillText(i, xmin_p2 + 0.5*x_step + (i-1)*x_step, ymin + 1.5*vh2px)
    }
    
    c3.font = Math.round(5*vh2px)+"px Verdana";
    c3.fillText("Generation", (xmin_p2 + xmax_p2)/2, ymin + 7* vh2px)

    c3.textAlign = "right";
    c3.textBaseline = "middle";
    c3.font = Math.round(4*vh2px)+"px Verdana";
    c3.fillStyle = "black";

    for(var i=0;i<=5;i++){
        c3.fillText(i*2/10, xmin_p2 - 1.5*1.5*vh2px, ymin - i*20*y_step)
    }

    //Plot titles
    c3.textAlign = "center";
    c3.textBaseline = "top";
    c3.font = "bold " + Math.round(6*vh2px)+"px Verdana";
    c3.fillText("ALLELE FREQUENCY", (xmin_p1 + xmax_p1)/2, 0)
    c3.fillText("PHENOTYPE FREQUENCY", (xmin_p2 + xmax_p2)/2, 0)

    //I will add the vertical text on both plots here, so I only have to rotate the canvas once.
    c3.save();
    c3.rotate(-Math.PI/2);
    c3.textAlign = "center";
    c3.textBaseline = "bottom";
    c3.font = Math.round(5*vh2px)+"px Verdana";
    c3.fillText("Frequency", (ymax - ymin)/2, xmin_p1-10* vh2px);
    c3.fillText("Frequency", (ymax - ymin)/2, xmin_p2-10* vh2px);
    c3.restore();
}