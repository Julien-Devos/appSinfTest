module.exports = {

    dateToTime: (postDate) => {
        let currDate = new Date();
        const months = ["Janv.","Févr.","Mars","Avr.","Mai","Juin","Juill.","Août","Sep.","Oct.","Nov.","Déc."];

        const diffTime = Math.abs(currDate - postDate);
        const diffDays = (diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 1){
            let postHrs = postDate.toLocaleString('fr-BE').split(",")[1].split(':');
            let currHrs = currDate.toLocaleString('fr-BE').split(",")[1].split(':');

            if (postHrs[0] === currHrs[0] && postHrs[1] === currHrs[1]){
                let secDiff = Math.round(currHrs[2] - postHrs[2]);
                return "Il y a " + secDiff + "s";
            }
            else if (postHrs[0] === currHrs[0] && postHrs[1] !== currHrs[1]){
                let minDiff = Math.round(currHrs[1] - postHrs[1]);
                return ("Il y a " + minDiff + " min.");
            }
            else if (postHrs[0] !== currHrs[0]){
                let hrsDiff = Math.round(currHrs[0] - postHrs[0]);
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
        else if (diffDays >= 1){
            let dateString = postDate.toLocaleString('fr-BE').split(",")[0].split('/');
            let day = dateString[0];
            let month = months[dateString[1] - 1];

            return (day + " " + month);
        }
    }

};