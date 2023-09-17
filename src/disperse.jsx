import React, { useState } from 'react';
import './disperse.css';
const Disperse = () => {
  const [inputTextForDuplicates, setInputTextForDuplicates] = useState('');
  const [inputTextForKeepFirstOne, setInputTextForKeepFirstOne] = useState('');
  const [error, setError] = useState('');
  
  const onSubmitForDuplicates = () => {
    const trimmedText = inputTextForDuplicates.trim();
    const errors = [];
    const lines = trimmedText.split('\n').map((line, index) => {
      const parts = line.trim().split(' ');
  
      const firstPart = parts[0].trim();
  
      if (parts.length > 1 && isNaN(parts[1].trim())) {
        errors.push(`Line ${index + 1}: Wrong amount - ${line}`);
        return '';
      } else {
        return firstPart;
      }
    });
  
    const validAddressesFiltered = lines.filter((address) => address !== '');
  
    const addressMap = new Map();
    lines.forEach((line, index) => {
      const firstPart = line.split(' ')[0];
      if (!addressMap.has(firstPart)) {
        addressMap.set(firstPart, []);
      }
      addressMap.get(firstPart).push(index);
    });
  
    const duplicateErrors = [];
    for (const [address, indices] of addressMap) {
      if (indices.length > 1) {
        const duplicateLines = indices.map((index) => ` ${index + 1}`).join(', ');
        duplicateErrors.push(`Address ${address} encountered duplicate in Line : ${duplicateLines}`);
      }
    }
  
    if (errors.length > 0) {
      setError(errors.join('\n'));
    } else if (duplicateErrors.length > 0) {
      setError(duplicateErrors.join('\n'));
    } else {
      setError('');
      console.log('Valid addresses for duplicates:', validAddressesFiltered);
    }
  };
  
  const onSubmitForKeepFirstOne = () => {
    const trimmedText = inputTextForKeepFirstOne.trim();
    const errors = [];
    const lines = trimmedText.split('\n');
    const resultLines = [];
    const seenAddresses = new Set();
  
    for (const line of lines) {
    
      const parts = line.trim().split(' ');
  
      
      const firstPart = parts[0].trim();
  
    
      if (parts.length > 1 && isNaN(parts[1].trim())) {
        errors.push('Wrong amount: ' + line);
      } else if (!seenAddresses.has(firstPart)) {
        seenAddresses.add(firstPart);
        resultLines.push(line);
      } else {
       
        const existingLineIndex = resultLines.findIndex((existingLine) =>
          existingLine.startsWith(firstPart)
        );
        if (existingLineIndex !== -1) {
          const existingParts = resultLines[existingLineIndex].trim().split(' ');
          const numericValue = parseInt(parts[1].trim());
          if (!isNaN(numericValue)) {
        
            existingParts[1] = (parseInt(existingParts[1]) + numericValue).toString();
            resultLines[existingLineIndex] = existingParts.join(' ');
          }
        }
      }
    }
  
    const resultText = resultLines.join('\n');
    setInputTextForKeepFirstOne(resultText);
  
    if (errors.length > 0) {
      setError(errors.join('\n'));
    } else {
      setError('Duplicate addresses merged (keeping the first one).');
      console.log('Valid addresses (keeping first one):', resultText);
    }
  };
  
  return (
    <div className="container">
      <h2>Disperse Component</h2>
      <div>
        <h3>Validate Duplicates</h3>
        <textarea
          rows="8"
          cols="44"
          className="textarea"
          placeholder="Enter addresses here..."
          onChange={(e) => setInputTextForDuplicates(e.target.value)}
          value={inputTextForDuplicates}
        />
        <br />
        <button className="button" onClick={onSubmitForDuplicates}>Submit for Duplicates</button>
      </div>
      <div>
        <h3>Keep First One</h3>
        <textarea
          rows="8"
          cols="44"
          className="textarea" 
          placeholder="Enter addresses here..."
          onChange={(e) => setInputTextForKeepFirstOne(e.target.value)}
          value={inputTextForKeepFirstOne}
        />
        <br />
        <button className="button" onClick={onSubmitForKeepFirstOne}>
          Apply and Remove Duplicates
        </button>
      </div>
      {error &&<div className='error'> <p style={{ color: 'red' }}>{error}</p></div>}
    </div>
  );

};

export default Disperse;
