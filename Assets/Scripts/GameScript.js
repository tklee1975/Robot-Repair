var customSkin:GUISkin;
var cols:int =4; //the number of columns in the card grid
var rows:int =4; // the number of rows in the card grid
var totalCards:int = cols*rows; // Total amount of cards in the grid
var matchesNeededToWin:int = totalCards * 0.5;  //Multiplying by 0.5 instead of dividing by 2 is faster
var matchesMade:int = 0; // At the outset, the player has not made any matches
var cardW:int = 100; //Each Card's width and height is 100 pixels
var cardH:int = 100;
var aCards:Array; // We'll store all the cards we create in this Array
var aGrid:Array; // This array will keep track of the shuffled, dealt cards
var aCardsFlipped:ArrayList; // This array will store the two cards that the player flips over
var playerCanClick:boolean = true; // We'll use this flag to prevent the player from clicking buttons when we don't want him to
var playerHasWon:boolean = false; // Store whether or not the player has won. This should probably start out false :)

function Start()
{
playerCanClick=true;
// Initialize the arrays as empty lists:
aCards = new Array();
aGrid = new Array();
aCardsFlipped = new ArrayList();

BuildDeck();

for(i=0;  i<rows;  i++)
{
aGrid[i] = new Array(); // Create a new, empty array at index i

	for(var j:int=0;  j<cols; j++)
	{
	var someNum:int = Random.Range(0,aCards.length);
	aGrid[i][j] = aCards[someNum];
	aCards.RemoveAt(someNum);
	}
}

}

class Card extends System.Object
{
	var isFaceUp:boolean = false;
	var isMatched:boolean = false;   // Note to self: Look at this line, where is it supposed to be????
	var img:String;
	var id:int;
	function Card(img:String,id:int)
	{
		this.img = img;
		this.id = id;
	}
}

function OnGUI () 
{
GUI.skin = customSkin;

GUILayout.BeginArea (Rect (0,0,Screen.width,Screen.height));
BuildGrid();

BuildMatchesCount();

if(playerHasWon) BuildWinPrompt();
GUILayout.EndArea();
//print("building grid!");
}

function BuildGrid()
{
	GUILayout.BeginVertical();
	GUILayout.FlexibleSpace();
	for(i=0; i<rows; i++)
	{
		GUILayout.BeginHorizontal();
		GUILayout.FlexibleSpace();
		for(j=0; j<cols; j++)
		{
		var card:Object = aGrid[i][j] ;
		var img:String;
		
		if(card.isMatched)
		{
			img = "blank";
		}
		else
		{
			if(card.isFaceUp)
			{
				img = card.img;
			}
			else
			{
				img = "wrench";
			}
		}
		
		GUI.enabled = !card.isMatched;
		if(GUILayout.Button(Resources.Load(img), GUILayout.Width(cardW)))
		{
			if(playerCanClick)
			{
				FlipCardFaceUp(card);
			}
		 Debug.Log(card.img);
		}
		GUI.enabled = true;
		}
		GUILayout.FlexibleSpace();
		GUILayout.EndHorizontal();
	}
	GUILayout.FlexibleSpace();
	GUILayout.EndVertical();
}

function BuildDeck()
{
	var totalRobots:int = 4; 
	var card:Object; //This stores a reference to a card
	var id:int = 0;
	
	for(i=0; i<totalRobots; i++)
	{
		var aRobotParts:Array = ["Head", "Arm", "Leg"];
		
		for(j=0; j<2; j++)
		{
			var someNum:int = Random.Range(0, aRobotParts.length);
			var theMissingPart:String = aRobotParts [someNum];
			
			aRobotParts.RemoveAt(someNum);
			
			card = new Card("robot" + (i+1) + "Missing" + theMissingPart, id);
			aCards.Add(card);
			
			card= new Card("robot" + (i+1) + theMissingPart, id);
			aCards.Add(card);
			id++;
		}
	}
	
}

function FlipCardFaceUp(card:Object)
{
	card.isFaceUp = true;
	
	if(aCardsFlipped.IndexOf(card) < 0)
	{
		aCardsFlipped.Add(card);
		
		if(aCardsFlipped.Count == 2)
		{
			playerCanClick = false;
			
			yield WaitForSeconds(1);
			
			if(aCardsFlipped[0].id == aCardsFlipped[1].id)
			{
			//Match!
				//aCardsFlipped[0].isFaceUp = false;
				//aCardsFlipped[1].isFaceUp = false;
				aCardsFlipped[0].isMatched = true;
				aCardsFlipped[1].isMatched = true;
				matchesMade++;
				if(matchesMade == matchesNeededToWin)
				{
				playerHasWon = true;
				}
			}
			else
			{
				aCardsFlipped[0].isFaceUp = false;
				aCardsFlipped[1].isFaceUp = false;
			}
			aCardsFlipped = new ArrayList();
			
			playerCanClick = true;
		}
	}
}

function BuildWinPrompt()
{
	var winPromptW:int = 100;
	var winPromptH:int = 90;
	
	var halfScreenW:float = Screen.width*0.5;
	var halfScreenH:float = Screen.height*0.5;
	
	var halfPromptW:int = winPromptW*0.5;
	var halfPromptH:int = winPromptH*0.5;
	
	GUI.BeginGroup(Rect(halfScreenW-halfPromptW, halfScreenH-halfPromptH, winPromptW, winPromptH));
	GUI.Box (Rect(0,0,winPromptW,winPromptH), "A Winner is You!!");
	
	if(GUI.Button(Rect(10,40,80,20), "Play Again"))
	{
		Application.LoadLevel("Title");
	}
	GUI.EndGroup();
}

function BuildMatchesCount()
{
var halfScreenW:int = Screen.width*0.5-75;
var quarterScreenH:int = Screen.height*0.14;
var matchesMadeCount:String = matchesMade + " Matches made";

GUI.BeginGroup(Rect(halfScreenW,quarterScreenH,150,50));

GUI.Box(Rect(0,0,150,50), matchesMadeCount);

GUI.EndGroup();
}