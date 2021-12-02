module.exports = {

    dateToTime: (postDate) => {
        let currDate = new Date();
        const months = ["Janv.","Févr.","Mars","Avr.","Mai","Juin","Juill.","Août","Sep.","Oct.","Nov.","Déc."];

        const diffTime = Math.abs(currDate - postDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHrs = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMin = Math.floor(diffTime / (1000 * 60));
        const diffSec = Math.floor(diffTime / 1000);

        console.log(diffHrs,diffSec);

        if (diffHrs < 24){
            let postHrs = postDate.toLocaleString('fr-BE').split(",")[1].split(':');
            let currHrs = currDate.toLocaleString('fr-BE').split(",")[1].split(':');

            if (diffSec < 60){
                let secDiff = Math.round(diffSec);
                return "Il y a " + secDiff + "s";
            }
            else if (diffMin < 60){
                let minDiff = Math.round(diffMin);
                return ("Il y a " + minDiff + " min.");
            }
            else {
                let hrsDiff = Math.round(diffHrs);
                return ("Il y a " + hrsDiff + "h");
            }
        }
        else if (diffDays >= 365){
            let dateString = postDate.toLocaleString('fr-BE').split(",")[0].split('/');
            let day = dateString[0];
            let month = months[dateString[1] - 1];
            let year = dateString[3];

            return (day + " " + month + " " + year);
        }
        else{
            let dateString = postDate.toLocaleString('fr-BE').split(",")[0].split('/');
            let day = dateString[0];
            let month = months[dateString[1] - 1];

            return (day + " " + month);
        }
    }

};