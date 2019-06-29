var score1=[90, 98, 89, 100, 100, 86, 94];
console.log("Average score for enviromental science");
console.log(average(score1))
var score2=[40, 65,77, 82, 80, 54, 73, 63, 95, 49];
console.log("Average score for Organic chemistry");
console.log(average(score2))

function average(scores)
{
    var sum=0;
    var avg;
    var length=scores.length
    scores.forEach(function(score){
        sum+=score;
    });
    avg=sum/length;
    return (Math.round(avg));
}