var customSkin:GUISkin;
function OnGUI () {
GUI.skin = customSkin;

// button width:
var buttonW:int = 100;
// button height:
var buttonH:int = 50;

//haflf of the Screen width:
var halfScreenW:float = Screen.width/2;
//half of the button width:
var halfButtonW:float = buttonW/2;


if(GUI.Button(Rect(halfScreenW-halfButtonW,Screen.height*0.7,buttonW,buttonH),"Play Game")) 
	{
		Application.LoadLevel("game");
	}
}