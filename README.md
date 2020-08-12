# AWS-EC2-Parse-Script

This script runs locally and iterates through a specified region in an AWS account. The output includes instance name, size, OS, etc. 

The script is designed to run locally and requires node.js to run. This script already assumes you have the AWS CLI tool installed. Additionally, you should already have the selected accounts to be inventoried scoped.

1. Install node with one of the following methods
    - curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"
    - brew install node
    - or download the installer directly from nodejs.org
2. Clone the repo
3. Navigate to the repo directory
4. Make sure to have your AWS profiles where you are running the scan selected. You can either import a configured list of AWS profiles or manually configure them. To manually configure them, complete the following:
    - aws configure --profile <profile name>. Skip adding the access and secret key and set the default region for the profile. For example "aws configure --profile test" enter, enter (set aws region: us-west-1) enter.
        - **IMPORTANT, This will not add role-ARN. These must be added manually. To add the role manually, navigate to the aws directory and type nano config. Then add "role_arn=.....(follow format below)**
    - If you manually upload profiles, use this format:
    [profile <Whatever Name you decide to call it]
    role_arn = arn:aws:iam::<aws account numner here>:role/<some role>
    source_profile = default
    region=<select the appropriate region where your aws account does buisness>
5. Change your AWS-Profile to the targed account and region
    - export AWS_profile=<name of profile>
6. Test to make sure you are in the correct account and region
    - aws s3 ls or aws sts get-caller-identity
7. Run the script node parse-ec2.js
8. This will create an exported csv called "<account number>-ec2-inventory.csv"
    - The script is placed in the same directory

Key Notes**
- Everytime the script is run it "appends" to the original file. If there is no original file for that account, the script creates a new file.
- This is a regional API. Make sure the accounts that you are pulling data from have their primary business in that region. This is identified in the region section of your profile. If you query us-west-2 in a region where the account is primarily working out of us-east-1, you will not get the results you are looking for.
