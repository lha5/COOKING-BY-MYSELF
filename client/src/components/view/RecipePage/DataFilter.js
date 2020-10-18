import React, { useState } from 'react';

function DataFilter(props) {
    const [checked, setChecked] = useState([]);

    const handleToggle = (value) => {
        const currentIndex = checked.indexOf(value);

        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        props.handleFilters(newChecked);
    };

    const renderCheckboxList = () => props.list && props.list.map((value, index) => (
        <React.Fragment key={index}>
            <span>
                <label>
                    <input type="checkbox" onChange={() => handleToggle(value._id)} checked={checked.indexOf(value._id) !== -1} />
                    <span> {value.name}</span>
                </label>
            </span>
        </React.Fragment>
    ));

    return (
        <div className="filterCategory">
            {renderCheckboxList()}
        </div>
    );
}

export default DataFilter;