document.addEventListener('DOMContentLoaded', () => {
    const formSelector = document.getElementById('form-type');
    const formContent = document.getElementById('form-content');

    formSelector.addEventListener('change', (e) => {
        const selectedForm = e.target.value;
        if (selectedForm) {
            loadForm(selectedForm);
        } else {
            formContent.innerHTML = '';
        }
    });

    function loadForm(formType) {
        let formHtml = '';
        switch (formType) {
            case 'bol':
                formHtml = `
                    <h3>Bill of Lading</h3>
                    <form id="bol-form">
                        <label for="shipper">Shipper:</label>
                        <input type="text" id="shipper" name="shipper" required>
                        <label for="consignee">Consignee:</label>
                        <input type="text" id="consignee" name="consignee" required>
                        <label for="origin">Origin:</label>
                        <input type="text" id="origin" name="origin" required>
                        <label for="destination">Destination:</label>
                        <input type="text" id="destination" name="destination" required>
                        <label for="goods-description">Description of Goods:</label>
                        <textarea id="goods-description" name="goods-description" required></textarea>
                        <label for="weight">Weight (kg):</label>
                        <input type="number" id="weight" name="weight" required>
                        <button type="submit">Submit</button>
                    </form>
                `;
                break;
            case 'shipping-request':
                formHtml = `
                    <h3>Shipping Request Form</h3>
                    <form id="shipping-request-form">
                        <label for="requester">Requester:</label>
                        <input type="text" id="requester" name="requester" required>
                        <label for="shipping-date">Shipping Date:</label>
                        <input type="date" id="shipping-date" name="shipping-date" required>
                        <label for="pickup-address">Pickup Address:</label>
                        <input type="text" id="pickup-address" name="pickup-address" required>
                        <label for="delivery-address">Delivery Address:</label>
                        <input type="text" id="delivery-address" name="delivery-address" required>
                        <label for="package-type">Package Type:</label>
                        <select id="package-type" name="package-type" required>
                            <option value="">Select package type</option>
                            <option value="box">Box</option>
                            <option value="pallet">Pallet</option>
                            <option value="container">Container</option>
                        </select>
                        <label for="special-instructions">Special Instructions:</label>
                        <textarea id="special-instructions" name="special-instructions"></textarea>
                        <button type="submit">Submit Request</button>
                    </form>
                `;
                break;
            case 'customs-declaration':
                formHtml = `
                    <h3>Customs Declaration Form</h3>
                    <form id="customs-declaration-form">
                        <label for="declarant">Declarant:</label>
                        <input type="text" id="declarant" name="declarant" required>
                        <label for="goods-origin">Country of Origin:</label>
                        <input type="text" id="goods-origin" name="goods-origin" required>
                        <label for="goods-value">Value of Goods:</label>
                        <input type="number" id="goods-value" name="goods-value" required>
                        <label for="hs-code">HS Code:</label>
                        <input type="text" id="hs-code" name="hs-code" required>
                        <label for="goods-description">Description of Goods:</label>
                        <textarea id="goods-description" name="goods-description" required></textarea>
                        <button type="submit">Submit Declaration</button>
                    </form>
                `;
                break;
            default:
                formHtml = '<p>Form not found.</p>';
        }
        formContent.innerHTML = formHtml;
        
        // Add form submission handler
        const form = formContent.querySelector('form');
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
        }
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const formObject = Object.fromEntries(formData.entries());

        if (validateForm(formObject)) {
            // In a real application, you'd send this data to your server
            console.log('Form data:', formObject);
            alert('Form submitted successfully!');
            form.reset();
        }
    }

    function validateForm(formData) {
        let isValid = true;
        const errorMessages = [];

        // Basic validation example
        for (const [key, value] of Object.entries(formData)) {
            if (!value.trim()) {
                isValid = false;
                errorMessages.push(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} is required.`);
            }
        }

        if (!isValid) {
            alert('Please correct the following errors:\n' + errorMessages.join('\n'));
        }

        return isValid;
    }
});
