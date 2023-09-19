import React, { useState } from 'react';
import './disperse.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Disperse = () => {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [lineCounter, setLineCounter] = useState(1);
  const [duplicateAddresses, setDuplicateAddresses] = useState(new Set());
const[show,setShow]=useState(false);
  const incrementLineCounter = () => {
    setLineCounter(lineCounter + 1);
  };
//console.log(show);
 // Function to throw a duplicate error
// Function to throw a duplicate error
const throwDuplicateError = (duplicates, duplicateLineNumbers) => {
  //console.log(duplicates,duplicateLineNumbers);
  if (duplicates.length > 0) {
    const duplicateErrors = duplicates.map((duplicate) => {
      const lineNumbers = duplicateLineNumbers[duplicate];
     
     if(lineNumbers.length > 1){
      setShow(true);
      return `Address ${duplicate} encountered in line ${lineNumbers.join(', ')}`;
  }} );

    throw new Error(duplicateErrors.join('\n'));
  }
};

const onSubmitForDuplicates = () => {
  const trimmedText = inputText.trim();
  
  const errors = [];
  const linesArray = trimmedText.split('\n').map((line, index) => {
    const parts = line.trim().split(/[\s=,]+/); // Split by space, equals sign, or comma

    const firstPart = parts[0].trim();
    console.log(isNaN(parts[1].trim()))
    setShow(true);
    if (parts.length > 1 && (isNaN(parts[1].trim()) || (parts[1].trim()< 0)) ) {
      errors.push(` Line ${index + 1}Wrong amount, `);
      return '';
    } else {
      return firstPart;
    }
  });
  console.log(errors)
   const validAddressesFiltered = linesArray.filter((address) => address !== '');

  if (errors.length > 0) {
    setError(errors.join('\n'));
  } else {
    setError('');
    // Store duplicate addresses in the set
    const duplicateSet = new Set();
    const duplicateLineNumbers = {};

    linesArray.forEach((address, index) => {
      if (duplicateLineNumbers[address]) {
        duplicateLineNumbers[address].push(index + 1);
      } else {
        duplicateLineNumbers[address] = [index + 1];
      }
    });

    const duplicateErrors = Object.entries(duplicateLineNumbers).map(([address, lineNumbers]) => {
      return `Address ${address} encountered in line(s) ${lineNumbers.join(', ')}`;
    });

    if (duplicateErrors.length > 1) {
      // Throw an error only if there are more than 1 duplicate addresses
      throwDuplicateError(Object.keys(duplicateLineNumbers), duplicateLineNumbers);
    }

    setCurrentStep(currentStep + 1); // Move to the next step
  }
};

  const onSubmitForKeepFirstOne = () => {
    const trimmedText = inputText.trim();
    const errors = [];
    const lines = trimmedText.split('\n');
    const resultLines = [];
    const seenAddresses = new Set();

    for (const line of lines) {
      const parts = line.trim().split(/[\s=,]+/); // Split by space, equals sign, or comma
      const firstPart = parts[0].trim();

      if (parts.length > 1 && isNaN(parts[1].trim())) {
        errors.push('Wrong amount: ' + line);
      } else if (!seenAddresses.has(firstPart)) {
        seenAddresses.add(firstPart);
        resultLines.push(line);
      } else {
        // Handle duplicates encountered during step 2
        if (duplicateAddresses.has(firstPart)) {
         // errors.push(`Duplicate address ${firstPart} encountered in line ${lines.indexOf(line) + 1}`);
        } else {
          const existingLineIndex = resultLines.findIndex((existingLine) =>
            existingLine.startsWith(firstPart)
          );
          if (existingLineIndex !== -1) {
            const existingParts = resultLines[existingLineIndex].trim().split(/[\s=,]+/);
            const numericValue = parseInt(parts[1].trim());
            if (!isNaN(numericValue)) {
              existingParts[1] = (parseInt(existingParts[1]) + numericValue).toString();
              resultLines[existingLineIndex] = existingParts.join(' ');
            }
          }
        }
      }
    }

    const resultText = resultLines.join('\n');
    setInputText(resultText);

    if (errors.length > 0) {
      setError(errors.join('\n'));
    } else {
      toast.success('Submitted successfully!', {
        position: 'top-right',
        autoClose: 2000, // Close the notification after 2 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log('Valid addresses (keeping first one):', resultText);
    setShow(false);
    }
  };
  const onSubmitForKeepFirstOne1 = () => {
    const trimmedText = inputText.trim();
    const errors = [];
    const lines = trimmedText.split('\n');
    const resultLines = {};
    const seenAddresses = new Set();
  
    for (const line of lines) {
      const parts = line.trim().split(/[\s=,]+/); // Split by space, equals sign, or comma
      const firstPart = parts[0].trim();
  
      if (!seenAddresses.has(firstPart)) {
        seenAddresses.add(firstPart);
        resultLines[firstPart] = parts.slice(1).join(' '); // Store the value after space, comma, or equal symbol
      } else {
       // errors.push(`Duplicate address ${firstPart} encountered in line ${lines.indexOf(line) + 1}`);
      }
    }
  
    const resultText = Object.keys(resultLines).map((key) => `${key} ${resultLines[key]}`).join('\n');
    setInputText(resultText);
  
    if (errors.length > 0) {
      setError(errors.join('\n'));
    } else {
      toast.success('Submitted successfully!', {
        position: 'top-right',
        autoClose: 2000, // Close the notification after 2 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log('Valid addresses (keeping first one without addition):', resultText);
      setShow(false)
    }
  };

  const handleNextClick = () => {
    if (currentStep === 1 ) {
      try {
        onSubmitForDuplicates();
      } catch (e) {
        setError(e.message);
      }
    } 
    
  };

  const handleTextareaChange = (e) => {
    setInputText(e.target.value);
    // Split the input text by lines and update the line counter
    const lines = e.target.value.split('\n');
    setLineCounter(lines.length);
  };
console.log(error.length)
  return (
    <div className="container">
      <div>
       <span>Addresses with Amount</span>
        <div className="textarea-container">
          <div className="line-numbers">
            {inputText.split('\n').map((line, index) => (
              <div key={index} className="line-number">
                {index + 1}
              </div>
            ))}
          </div>
          
          <textarea
            rows="8"
            cols="44"
            className="textarea"
            placeholder="Enter addresses here..."
            onChange={handleTextareaChange}
            value={inputText}
          />
        </div>
        <p>Separated by ',' or ' ' or '='</p>
        <br />
        {show && (<div className='btns'>
        <button className='btn' onClick={onSubmitForKeepFirstOne}>Combine balance</button>|

        <button  className='btn' onClick={onSubmitForKeepFirstOne1}>Keep the First One</button></div>)}
        {(show )&& (
          <div className="error">
            <p style={{ color: 'red' }}>{error}</p>
          </div>
        )}
        
        <button className="button" onClick={handleNextClick}>
          
          {currentStep === 1 ? 'Next' : 'Submit'}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Disperse;
