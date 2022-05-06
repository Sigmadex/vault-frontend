<img src="https://user-images.githubusercontent.com/33762147/155625647-55c69f06-e0ea-44a8-a425-7aa086c329c5.png" style="border-radius:50%;width:72px;">

# React Front-End for vault Smart Contract (SEP-001)

## Summary

This application integrates with any Sigmadex Smart Contract Vault. You may change settings in the `config.json` file.

## Curl Installation

Install CURL using the following command:

``sudo apt install curl``

## Obtain NodeJS 14

Front-end requires NodeJS 14, you can verify your current version by running:

``node -v``

Run the following command to download Version 14 which is a minimum requirement.

``curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -``

After downloading, you can run:

``sudo apt install -y nodejs``

## Download create-react-app

``npm install -g create-react-app``

Switch to create-react-app directory and use git to download to the newly created folder.

## Clone repository into create-react-app folder

Download the repo using:

``gh repo clone Sigmadex/vault-frontend``

Edit the `public/config.json` file to select the appropriate network requested. In this case we are using the Avalanche Fuji testnet.

```
{
    "NETWORK_ID": 43113,
    "API_KEY": "<Enter API Key>",
    "API_URL": "https://api-testnet.snowtrace.io/"
}
```

After overwriting all files, run:

``npm start`` to run the app.
