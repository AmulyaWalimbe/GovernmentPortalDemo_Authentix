// Function to clean and hash data
// Function to clean and hash data
async function clean(data) {
    // Remove special characters using regular expression
    const cleanedData = data
        .replace(/[^a-zA-Z0-9]/g, '') // Remove non-alphanumeric characters
        .toUpperCase(); // Convert to uppercase

    return cleanedData;
}

async function clean2(inputData) {
    // remove all non-numeric characters
    const cleanedData2 = inputData.replace(/[^0-9]/g, '');

    return cleanedData2;
}

async function hash(concatfinal) {
    const hashHex = md5(concatfinal);

    return hashHex;
}


// Function to handle form submission
async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get user input from the form
    const firstName = document.getElementById('firstName').value;
    const middleName = document.getElementById('middleName').value;
    const lastName = document.getElementById('lastName').value;
    const line1 = document.getElementById('line1').value;
    const line2 = document.getElementById('line2').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;
    const country = document.getElementById('country').value;
    const ethereumAddress = document.getElementById('ethereumAddress').value;
    const aadhar = document.getElementById('aadhar').value;

    // Concatenate the form data
    const concatenatedData = `${firstName}${middleName}${lastName}${line1}${line2}${city}${state}${country}`;
    const concatenatedData2 = `${zip}${aadhar}`;

    // Clean and hash the data
    const cleansed = await clean(concatenatedData);
    const cleansed2 = await clean2(concatenatedData2);

    const concatfinal = `${cleansed}${cleansed2}`;

    console.log('concatenated data: ',concatfinal);

    const hashedData = await hash(concatfinal);

    // Display the result on the page
    const resultElement = document.getElementById('result');
    resultElement.textContent = `Concatenated and Hashed Data: ${hashedData}`;

    // Store the hashed data in a variable (for example, 'hashedDataVariable')

}

// Function to truncate a string to 32 bytes (64 hexadecimal characters)
// function truncateToBytes32(input) {
//     const hexString = ethers.utils.toUtf8Bytes(input).slice(0, 32);
//     return ethers.utils.hexlify(hexString).padEnd(66, '0'); // Pad to 66 characters
// }

// Event listener for the "Register" button click
const registerButton = document.getElementById('registerButton');
registerButton.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Get user input from the form
    const firstName = document.getElementById('firstName').value;
    const middleName = document.getElementById('middleName').value;
    const lastName = document.getElementById('lastName').value;
    const line1 = document.getElementById('line1').value;
    const line2 = document.getElementById('line2').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;
    const country = document.getElementById('country').value;
    const ethereumAddress = document.getElementById('ethereumAddress').value;
    const aadhar = document.getElementById('aadhar').value;

    // Concatenate the form data
    const concatenatedData = `${firstName}${middleName}${lastName}${line1}${line2}${city}${state}${country}`;
    const concatenatedData2 = `${zip}${aadhar}`;

    // Clean and hash the data
    const cleansed = await clean(concatenatedData);
    const cleansed2 = await clean2(concatenatedData2);

    const concatfinal = `${cleansed}${cleansed2}`;

    const hashedData = await hash(concatfinal);

    // Display the result on the page
    const resultElement = document.getElementById('result');
    resultElement.textContent = `Concatenated and Hashed Data: ${hashedData}`;

    // Send data to the smart contract
    try {
        // Connect to your Ethereum provider and prepare the transaction
        const provider = new ethers.providers.JsonRpcProvider('https://ethereum-sepolia.blockpi.network/v1/rpc/public'); // Replace with your Ethereum provider URL
        const privateKey = '53edabd8e9dd5a6fffe4d3bad340b4378bbdc40140315435467e08de907e2376'; // Replace with your private key
        const wallet = new ethers.Wallet(privateKey, provider);

        const contractABI = [
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "txnHash",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "originID",
                        "type": "string"
                    }
                ],
                "name": "confirmRequest",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "txnHash",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "originID",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "responseCode",
                        "type": "string"
                    }
                ],
                "name": "requestStatus",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_hash",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "userAddress",
                        "type": "address"
                    }
                ],
                "name": "storeIdMapping",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "_encryptedData",
                        "type": "bytes32"
                    }
                ],
                "name": "searchMapping",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ];
        const contractAddress = '0xE846387e715d4320c46518e9F4F4Ad243ED6dadE'; // Replace with your contract address
        const contract = new ethers.Contract(contractAddress, contractABI, wallet);

        // Convert the hashed data to bytes32 (truncated if too long)
        // const hashedDataBytes32 = truncateToBytes32(hashedData);

        // Set an initial gas limit (you can adjust this value based on your needs)
        const initialGasLimit = 3000000; 
        
        const gasPrice = ethers.utils.parseUnits('5', 'gwei');
        // Specify a gas price (in wei) based on your network's current gas prices
        
        // Send the transaction to store the data
        const tx = await contract.storeIdMapping(hashedData, ethereumAddress, {
            gasLimit: initialGasLimit,
            gasPrice: gasPrice,
        });

        console.log('Transaction Hash:', tx.hash);
        console.log('Data Hash ', hashedData);
        console.log('Ethereum Address ', ethereumAddress);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        // Check if the transaction was successful
        if (receipt.status === 1) {
            console.log('Transaction Successful');
            // View the stored data (replace with your contract's method to retrieve data)
            // const storedData = await contract.searchMapping(hashedDataBytes32); // Change to use 'hashedDataBytes32'
            // console.log('Stored Ethereum Address:', storedData);
        } else {
            console.error('Transaction Failed');
            console.error('Transaction Receipt:', receipt);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
