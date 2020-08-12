//Required modules to run the code
process.env.AWS_SDK_LOAD_CONFIG="true"
const AWS = require('aws-sdk');
AWS.config.update({region: "us-west-2"});
const ec2 = new AWS.EC2();
const sts = new AWS.STS();
const fs = require('fs');


try {
    //lists the AWS account number that is being scanned
    sts.getCallerIdentity(function(err, data) {
        if(err){console.log(`Oops, something went wrong with the sts API ${err}`)}
        let awsAcctNum = data.Account
        awsAcctNum = JSON.stringify(awsAcctNum)
        console.log(`Processing request for AWS Account: ${awsAcctNum}`)
        //Describe Intance API to pull back EC2 Launch time and Image AMI (AMI will be passed to next API call)
    ec2.describeInstances(function(err, data) {
        if (err) {console.log(`Oops, something went wrong with the describe Instance API! ${err}`)}
        //Empty Arrays to store data pulled from API calls
        const instanceObj = [];
        const joinedReport = [];
        const instance = data.Reservations
        instance.forEach((aArn) => {
            const images = aArn.Instances
            images.forEach((bArn) => {
                //Parsed call with Instance and Image being stored values pushed to above arrays
                const instanceToString = bArn.InstanceId.toString();
                const imageToString = bArn.ImageId.toString();
                const launchToString = bArn.LaunchTime.toString();
                instanceObj.push(imageToString + (' , ') + launchToString);
                //Saved AMI call ('instanceId variable') this will be passed to the next API call
                let params = {ImageIds: [imageToString]}
                //Looped API call to gather rest of data including OS type
                ec2.describeImages(params, function(err, bData) {
                    if (err) {console.log(`Oops, something went wrong with the describeImages API! ${err}`)} 
                        const output = bData.Images[0]
                        //const platformDeets = output.PlatformDetails;
                        const outName = output.Name;
                        const joinedData = `${awsAcctNum} | ${instanceToString} | ${imageToString} | ${launchToString} | ${outName} |`;
                        joinedReport.push(joinedData)
                        //Appends every subsequent output to the "joinedData" file
                        fs.appendFile(`./${awsAcctNum}-ec2-inventory.csv`, joinedData + ('\n'), function (err) {
                    }

                    )
                })
            })
        })
    })
})
    setTimeout(complete => {
        console.log('File output complete!')
    }, 2000)
}catch(err) {console.log (`Something went wrong ${err}`)}