var container = $("#container");
var livestxt=$("#lives");
var leveltxt=$("#level");
var counthit=0;
var move=0;
var lives=4;
var level=1;
var t1 = 0;
var soundOn=0;
var stickWidth,stickHeight,blockwidth,blockheight,ballwidth,ballheight;
var stickStep = 13;
var stickMove=0;
var containerWidth=parseInt(container.css("width"));
var containerHeight=parseInt(container.css("height"));
var initBallStepLeft=10;
var initBallStepTop=10;
var ballstepleft=initBallStepLeft;
var ballsteptop=-initBallStepTop;
var ballleft,balltop;
var sound=document.getElementById("sound");

/////////draw blocks function

function drawBlocks(){
    var block;
    var j=0;
    for(var i=0;i<9&&j<4;i++){
        block=$("<div></div>").addClass("block");
        block.css({"top":20+20*j+"px" , "left":40+70*i+"px"});
        container.append(block);
        if(i==8){
            i=-1;
            j++;
        }

    }
    blockwidth=parseInt($(".block").css("width"));
    blockheight=parseInt($(".block").css("height"));

}

function drawBall(top,left){
    var myball=$("<div></div>").addClass("ball");
    if(top&&left){
        myball.css({"top":top+"px" , "left":left+"px"});
    }
    else {
        myball.css({"top":350+"px" , "left":345+"px"});
    }
    container.append(myball);
    ballwidth=parseInt($(".ball").css("width"));
    ballheight=parseInt($(".ball").css("height"));
}

function drawStick(level){
    var mystick=$("<div></div>").addClass("stick");
    if(level>=4){
        mystick.css({"top":365+"px" , "left":320+"px","width":50+"px"});
    }
    else if(level>=2){
        mystick.css({"top":365+"px" , "left":320+"px","width":75+"px"});
    }
   else {
        mystick.css({"top":365+"px" , "left":320+"px"});
    }
    container.append(mystick);
    stickWidth=parseInt($(".stick").css("width"));
    stickHeight=parseInt($(".stick").css("height"));
}



drawBlocks();
drawBall();
drawStick();


window.requestAnimationFrame(function refresh(t2){
    var dt = t2 - t1;
    t1 = t2;
    var ball =$(".ball");
    var stick = $(".stick");
    ballleft=parseInt(ball.css("left"));
    balltop=parseInt(ball.css("top"));
    var stickTop = parseInt(stick.css("top"));
    var stickLeft = parseInt(stick.css("left"));
    var maxWidth;
    livestxt.html("<h3>"+lives+"</h3>");
    leveltxt.html("<h3>"+level+"</h3>");
    if (balltop<=0){     ////collision with container ceiling
        ballsteptop=-ballsteptop;
        if(balltop >((containerWidth/2)-5) && balltop<((containerWidth/2)+5)){
            ballsteptop=ballsteptop+1;
        }
    }

    if(balltop>=containerHeight-ballheight){  ////collision with container ground

        if(lives>0){
            ballsteptop=-initBallStepTop;
            ballstepleft=initBallStepLeft;
            ball.remove();
            drawBall(stickTop-15,stickLeft+20);
            move=0;
            lives--;
        }

        if(lives<=0){
            alert("game over");
            $(".block").remove();
            location.reload();
        }

    }
    if (ballleft<=0){   ////collision with container  left  wall
        ball.css({"left":15+"px"});
        ballstepleft=initBallStepLeft;
    }
    if (ballleft>=containerWidth){   ////collision with container  left and right walls
        ball.css({"left":containerWidth-5+"px"});
        ballstepleft=-initBallStepLeft;
    }

    if( (balltop+ballheight) >= stickTop && (balltop+ballheight) <= stickTop+5 &&
        (ballleft+ballwidth) >= stickLeft && ballleft <= (stickLeft+stickWidth)){    ////collision with stick
        //ball.css({"left":ballleft+ballstepleft+"px"});
        ball.css({"top":balltop-stickHeight-ballheight+"px"});
        //soundOn=1;
	    sound.innerHTML='<audio autoplay="autoplay"><source src="rod.mp3" />';
        ballsteptop=-ballsteptop;
        if(ballstepleft>0){
            ballstepleft=((ballleft+ballwidth/2)-(stickLeft+stickWidth/2))%(initBallStepLeft*2);
            if(ballstepleft==0){
                ballstepleft+=2;
            }
        }
        else if(ballstepleft<0){
            ballstepleft=((ballleft+ballwidth/2)-(stickLeft+stickWidth/2))%(initBallStepLeft*2);
            if(ballstepleft==0){
                ballstepleft-=2;
            }
        }
        //console.log("ball top",balltop);
        //console.log("stick top",stickTop);
    }
    else if( (balltop+ballheight) >= stickTop+2 && (balltop+ballheight) <= stickTop+2 &&
        ((ballleft+ballwidth) >= stickLeft-2)&& ((ballleft+ballwidth) >= stickLeft+2)){
        ballstepleft=-ballstepleft;
    }
    /*if(soundOn==1){
        document.getElementById("sound").innerHTML='<audio autoplay="autoplay"><source src="exp.ogg" />';
        soundOn=0;
    }*/

    $(".block").each(function(){   ////collision with blocks

        if( (balltop+ballheight) >= $(this).position().top && balltop <= (($(this).position().top)+blockheight) &&
            (ballleft+ballwidth) >= $(this).position().left && ballleft <= (($(this).position().left)+blockwidth) ){
            ballsteptop=-ballsteptop;
            //soundOn=1;
	        sound.innerHTML='<audio autoplay="autoplay"><source src="exp.ogg" />';
            $(this).remove();
            counthit++;
            //console.log("hit count",counthit);
            if(counthit>=36){     /////hit all blocks
                move=0;
                level++;
                if(level>5){     ///finished game
                    alert("You won, stop playing now");
                    location.reload();
                }
                else {      ////// level up
                    counthit=0;
                    ball.remove();
                    stick.remove();
                    drawBlocks();
                    drawBall();
                    alert("level up");
                    drawStick(level);
                    if(level==3&&level==5){
                        ballstepleft=initBallStepLeft+2;
                        ballsteptop=initBallStepTop+2;
                    }

                }



            }
        }
    });

    if(move){     /////moving ball
        ball.css({"left":ballleft+ballstepleft+"px"});
        ball.css({"top":balltop+ballsteptop+"px"});
    }
    maxWidth = containerWidth -stickWidth;
    if (stickMove==1 && stickLeft < maxWidth){    /////moving stick right
        if(stickStep <= maxWidth-stickLeft){
            stick.css({"left":stickLeft+stickStep+"px"});
        }
        else{
            stick.css({"left":maxWidth+"px"});
        }

    }
    else if(stickMove==-1&&stickLeft >= 0){    /////moving stick left
        if(stickStep <= stickLeft){
            stick.css({"left":stickLeft-stickStep+"px"});
        }
        else{
            stick.css({"left":0+"px"});
        }

    }
    document.getElementById('asd').innerHTML ='<br>Time : ' + parseInt(t1/1000)+" seconds";

    window.requestAnimationFrame(refresh);
});

window.addEventListener('keydown', function (ev) {
    move=1;
    var stick = $(".stick");
    var stickLeft = parseInt(stick.css("left"));
    var maxWidth = containerWidth -stickWidth - stickStep;
    switch (ev.keyCode) {
        case 39:   /*Right*/
            stickMove=1;

            break;
        case 37:   /*Left*/
            stickMove=-1;
            break;
    }

})
window.addEventListener('keyup', function (ev) {
    stickMove=0;

})
