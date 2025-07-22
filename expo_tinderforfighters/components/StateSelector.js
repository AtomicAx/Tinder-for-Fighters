import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import CustomModalSelector from '../components/CustomModalSelector';

const states = [
  { key: 'AL', label: 'Alabama (AL)', value: 'AL' },
  { key: 'AK', label: 'Alaska (AK)', value: 'AK' },
  { key: 'AZ', label: 'Arizona (AZ)', value: 'AZ' },
  { key: 'AR', label: 'Arkansas (AR)', value: 'AR' },
  { key: 'CA', label: 'California (CA)', value: 'CA' },
  { key: 'CO', label: 'Colorado (CO)', value: 'CO' },
  { key: 'CT', label: 'Connecticut (CT)', value: 'CT' },
  { key: 'DE', label: 'Delaware (DE)', value: 'DE' },
  { key: 'FL', label: 'Florida (FL)', value: 'FL' },
  { key: 'GA', label: 'Georgia (GA)', value: 'GA' },
  { key: 'HI', label: 'Hawaii (HI)', value: 'HI' },
  { key: 'ID', label: 'Idaho (ID)', value: 'ID' },
  { key: 'IL', label: 'Illinois (IL)', value: 'IL' },
  { key: 'IN', label: 'Indiana (IN)', value: 'IN' },
  { key: 'IA', label: 'Iowa (IA)', value: 'IA' },
  { key: 'KS', label: 'Kansas (KS)', value: 'KS' },
  { key: 'KY', label: 'Kentucky (KY)', value: 'KY' },
  { key: 'LA', label: 'Louisiana (LA)', value: 'LA' },
  { key: 'ME', label: 'Maine (ME)', value: 'ME' },
  { key: 'MD', label: 'Maryland (MD)', value: 'MD' },
  { key: 'MA', label: 'Massachusetts (MA)', value: 'MA' },
  { key: 'MI', label: 'Michigan (MI)', value: 'MI' },
  { key: 'MN', label: 'Minnesota (MN)', value: 'MN' },
  { key: 'MS', label: 'Mississippi (MS)', value: 'MS' },
  { key: 'MO', label: 'Missouri (MO)', value: 'MO' },
  { key: 'MT', label: 'Montana (MT)', value: 'MT' },
  { key: 'NE', label: 'Nebraska (NE)', value: 'NE' },
  { key: 'NV', label: 'Nevada (NV)', value: 'NV' },
  { key: 'NH', label: 'New Hampshire (NH)', value: 'NH' },
  { key: 'NJ', label: 'New Jersey (NJ)', value: 'NJ' },
  { key: 'NM', label: 'New Mexico (NM)', value: 'NM' },
  { key: 'NY', label: 'New York (NY)', value: 'NY' },
  { key: 'NC', label: 'North Carolina (NC)', value: 'NC' },
  { key: 'ND', label: 'North Dakota (ND)', value: 'ND' },
  { key: 'OH', label: 'Ohio (OH)', value: 'OH' },
  { key: 'OK', label: 'Oklahoma (OK)', value: 'OK' },
  { key: 'OR', label: 'Oregon (OR)', value: 'OR' },
  { key: 'PA', label: 'Pennsylvania (PA)', value: 'PA' },
  { key: 'RI', label: 'Rhode Island (RI)', value: 'RI' },
  { key: 'SC', label: 'South Carolina (SC)', value: 'SC' },
  { key: 'SD', label: 'South Dakota (SD)', value: 'SD' },
  { key: 'TN', label: 'Tennessee (TN)', value: 'TN' },
  { key: 'TX', label: 'Texas (TX)', value: 'TX' },
  { key: 'UT', label: 'Utah (UT)', value: 'UT' },
  { key: 'VT', label: 'Vermont (VT)', value: 'VT' },
  { key: 'VA', label: 'Virginia (VA)', value: 'VA' },
  { key: 'WA', label: 'Washington (WA)', value: 'WA' },
  { key: 'WV', label: 'West Virginia (WV)', value: 'WV' },
  { key: 'WI', label: 'Wisconsin (WI)', value: 'WI' },
  { key: 'WY', label: 'Wyoming (WY)', value: 'WY' },
];



export default function StateSelector({
    label = 'Select State',
    initialState = null,
    onChange,

}) {
    const [selectedState, setSelectedState] = useState(initialState)

    const handleStateChange = (newState) => {
        setSelectedState(newState);
        if (onChange) {
            onChange(newState.value);
            console.log('state value:', newState.value);
        }

    };

    return (
        <View style={styles.wrapper}>
            <CustomModalSelector
                data={states}
                value={selectedState}
                onChange={handleStateChange}
                placeholder={label}
                width={'88%'}
            
            />

        </View>

    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginVertical: 15,
        alignItems: 'center',
    },
});