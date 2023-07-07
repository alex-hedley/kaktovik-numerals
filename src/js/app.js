(async() => {
    // https://gist.github.com/CatherineH/5d923ec585acdb89ab2df34c095a681c
    const oneResponse = await fetch('images/digits/Kaktovik_digit_1.svg');
    const one = await oneResponse.text();
    // console.log(one);

    const fiveResponse = await fetch('images/digits/Kaktovik_digit_5.svg');
    const five = await fiveResponse.text();
    // console.log(five);

    var svgSix = addSVGs([one, five]);
    document.getElementById("six").innerHTML = svgSix.innerHTML;

    const tenResponse = await fetch('images/digits/Kaktovik_digit_10.svg');
    const ten = await tenResponse.text();
    // console.log(ten);

    var svgFifteen = addSVGs([five, ten]);
    document.getElementById("fifteen").innerHTML = svgFifteen.innerHTML;
})();

function addSVGs(inputStrings){
    // takes a list of strings of SVGs to merge together into one large element
    let svgMain = document.createElement("svg");
    for (let stringI=0; stringI < inputStrings.length; stringI++) {
        let domParser = new DOMParser();
        let svgDOM = domParser.parseFromString(inputStrings[stringI], 'text/xml')
            .getElementsByTagName('svg')[0];
        var digit = getDigit(svgDOM);
        
        while (svgDOM.childNodes.length > 0) {
            var node = svgDOM.childNodes[0];
            // console.log(node);
            // console.log(node.nodeName);
            if (node.nodeName === 'path') {
                console.log(typeof(digit));
                switch (digit) {
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        node.style.fill = '#9e2194';
                        break;
                    case 5:
                    case 10:
                        node.style.fill = '#00a1a4';
                        break;
                    // case (digit === 1):
                    //     node.style.fill = '#00a1a4'; // #9e2194
                    //     break;
                    // case (digit < 5):
                    //     node.style.fill = '#00a1a4'; // #9e2194
                    //     break;
                    // case (digit === 5):
                    //     node.style.fill = '#9e2194';
                    //     break;
                    default:
                        console.error('None matched');
                        break;
                }
            }
            // console.log(node.nodeType);
            // console.log(node.ATTRIBUTE_NODE);
            // node.style.fill = '#aaa';
            svgMain.appendChild(node);
        }
    }
    return svgMain
}

function getDigit(svgDOM) {
    let name = svgDOM.getAttribute("sodipodi:docname");
    console.log(name);
    var digit = parseInt(name.split("_")[2].split(".")[0]);
    console.log(digit);
    return digit;
}