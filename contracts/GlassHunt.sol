//located at: 0x680a09ec5a6a33c8cdf7e8b37e8d8472d6988eb9

contract tokenRecipient {

    function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData); }

contract GlassToken {
    /* Public variables of the token */
    string public standard = 'Token 0.1';
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    address owner = 0xb43F39D63C69e6451167De6170DEaa1d7E503623;

    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;

    /* This generates a public event on the blockchain that will notify clients */
    event Transfer(address indexed from, address indexed to, uint256 value);


    modifier onlyOwner(){
        if(owner == msg.sender) _
    }

    /* Initializes contract with initial supply tokens to the creator of the contract */
    function GlassToken() {
        address firstOwner = msg.sender;
        balanceOf[firstOwner] = 50600000;              // Give the creator all initial tokens
        totalSupply =  50600000;                        // Update total supply
        name = "Glass";                                   // Set the name for display purposes
        symbol = "⬢";                               // Set the symbol for display purposes
        decimals = 2;                            // Amount of decimals for display purposes
        var _unused = msg.sender.send(msg.value);                         // Send back any ether sent accidentally
    }

    /* Send coins */
    function transfer(address _to, uint256 _value) {
        if (balanceOf[msg.sender] < _value) throw;           // Check if the sender has enough
        if (balanceOf[_to] + _value < balanceOf[_to]) throw; // Check for overflows
        balanceOf[msg.sender] -= _value;                     // Subtract from the sender
        balanceOf[_to] += _value;                            // Add the same to the recipient
        Transfer(msg.sender, _to, _value);                   // Notify anyone listening that this transfer took place
    }

    /* Allow another contract to spend some tokens in your behalf */
    function approve(address _spender, uint256 _value)
        returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        return true;
    }

    /* Approve and then comunicate the approved contract in a single tx */
    function approveAndCall(address _spender, uint256 _value, bytes _extraData)
        returns (bool success) {
        tokenRecipient spender = tokenRecipient(_spender);
        if (approve(_spender, _value)) {
            spender.receiveApproval(msg.sender, _value, this, _extraData);
            return true;
        }
    }

    /* A contract attempts to get the coins */
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        if (balanceOf[_from] < _value) throw;                 // Check if the sender has enough
        if (balanceOf[_to] + _value < balanceOf[_to]) throw;  // Check for overflows
        if (_value > allowance[_from][msg.sender]) throw;   // Check allowance
        balanceOf[_from] -= _value;                          // Subtract from the sender
        balanceOf[_to] += _value;                            // Add the same to the recipient
        allowance[_from][msg.sender] -= _value;
        Transfer(_from, _to, _value);
        return true;
    }

    // People sent donations to this contract. Collect them
    function collectExcess() onlyOwner{

      var _unused = owner.send(this.balance-2100000);
    }





    //donations
    function () {
         // Just being sent some cash?
         //Collect as donation
    }
}



contract OilOption is GlassToken{

    address public owner = msg.sender;

    address public watch_addr  = 0xc7c40ad438a86d4bdea1f013a1ed8eefa357fbc1;

    GlassToken public proxObj = GlassToken(watch_addr);



    function OilOption(){
        owner= msg.sender;

    }

    function setWatchAddr(address _watch_addr) {
      watch_addr = _watch_addr;
      proxObj = GlassToken(watch_addr);
    }

    //This contract gives one party the option to purchase oil for a certain amount from ex exchange.

    //As of this writing, one barrel of crude is 4090000000000000000wei or 4.09 ether/...this price is significatly lower here... divided by alot
    mapping (address => uint256) public balanceOf1;
    mapping (address => uint256) public balanceCrudeOf1;

    modifier onlyOwner  { if(msg.sender == owner) _ }

    uint public barrelPrice  = 409;
    uint public barrelSplit = 20;

    function buyOil(){

        if(msg.value >=barrelPrice){


                balanceOf1[msg.sender] += msg.value;
                balanceCrudeOf1[msg.sender] += msg.value/barrelPrice;

        }
        else{

            //sent too little?
            throw;
        }
    }
    function sellOil(uint256 amount) returns (bool){

        if(balanceOf1[msg.sender] < amount){
            throw;
        }


        if(proxObj.balanceOf(msg.sender) >barrelSplit){
            var _unused = msg.sender.send(amount);
            return true;
        }


        uint256 toWithdraw= amount/barrelPrice;


        if(msg.sender.send(amount) == true){

            balanceOf1[msg.sender] -= amount;
            balanceCrudeOf1[msg.sender] -= toWithdraw;
            sendGlass(1, msg.sender);
            return true;
        }
        else{
            return false;
        }

    }

    function sendGlass(uint256 amount, address userA) internal{

        proxObj.transfer(userA, amount);

    }


     function collectExcess() onlyOwner{

      var _unused = owner.send(this.balance-2100000);
    }



    function(){


    }
}




