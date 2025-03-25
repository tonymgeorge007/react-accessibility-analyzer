# This is a npm module to check all the accessibility needs at once.
# Sample usage

 import React, { useRef } from 'react';
 import { checkAltAttributes, checkARIACompliance, checkContrastRatio, analyzeTabIndex, checkSemanticHTML }  from 'react-accessibility-analyzer'; 

    const checkAltAttributesissues = checkAltAttributes(useRef().current);
        console.log('TabIndex Issues:', checkAltAttributesissues);

    const checkARIAComplianceissues = checkARIACompliance(useRef().current);
        console.log('ARIACompliance Issues:', checkARIAComplianceissues);

    const checkContrastRatioissues = checkContrastRatio(useRef().current);
        console.log('ContrastRatio Issues:', checkContrastRatioissues);

    const checkanalyzeTabIndex = analyzeTabIndex(useRef().current);
        console.log('analyzeTabIndex Issues:', checkanalyzeTabIndex);

    const checkSemanticHTMLConst = checkSemanticHTML(useRef().current);
        console.log('checkSemanticHTML Issues:', checkSemanticHTMLConst);