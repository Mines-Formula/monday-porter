import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import 'src/App.css'

function AddVendors({vendors, setVendors}) {
    async function handleSubmit(evt) {
        evt.preventDefault();
        const form = evt.target;
        const formData = new FormData(form);
        let nameInput = formData.get("name");
        let preferenceInput = formData.get("preference");
        let taxExceptionInput = formData.get("requiresTaxException");
        let salesTaxInput = formData.get("chargesCOSalesTax");
        let message = "";
        if (nameInput == "") {
            message += "Must enter in the name\n";
        }
        if (preferenceInput == "select_preference") {
            message += "Must enter in a preference\n"
        }
        if (taxExceptionInput == "select") {
            message += "Must enter in whether or not vendor requires tax exception\n"
        }
        if (salesTaxInput == "select") {
            message += "Must enter in whether or not vendor charges CO sales tax\n"
        }
        if (message != "") {
            alert(message);
            return;
        }

        //authenticate the user
        const passwordInput = formData.get("password");
        const params = new URLSearchParams();
        params.append("password", passwordInput);
        const result = await fetch(`/api/authenticate?${params}`);
        const authenticated = await result.json();
        console.log(authenticated);
        if (!authenticated) {
            alert("Incorrect password");
            return;
        }

        let spendingInput = formData.get("spending");
        let notesInput = formData.get("notes");
        const vendor = {
            name: nameInput,
            preference: preferenceInput,
            spending: spendingInput,
            notes: notesInput,
            requiresTaxException: taxExceptionInput,
            chargeCOSalesTax: salesTaxInput
        }
        let newVendors = [...vendors, vendor];

        const postRes = await fetch('/api/vendors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newVendors)
        }).then(res => {
            console.log(res);
        });
        console.log("Sent the information");
        const res = await fetch('/api/vendors');
        const data = await res.json();
        console.log(data);
        setVendors(data);
        alert("Successfuly added");
    }

    return (
        <Dialog.Root class="dialog">
        <Dialog.Trigger asChild>
            <Button backgroundColor="white" colorPalette="gray" variant="outline" size="sm">
            Add Vendor
            </Button>
        </Dialog.Trigger>
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
            <Dialog.Content>
                <Dialog.Header>
                <Dialog.Title>Add Vendor</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <p>Required fields marked with *</p>
                    <form id="addVendor" onSubmit={handleSubmit}>
                        <div class="inputArea">
                            <label for="name">Vendor Name: *</label> <input type="text" id="name" name="name"></input>
                        </div>
                        <div class="inputArea">
                            <label for="spending">Spending: </label> <input type="number" id="spending" defaultValue="0.00" name="spending" min="0.0"></input>
                        </div>
                        <div class="inputArea">
                            <label for="preference">Preference: *</label>
                            <select id="preference" name="preference">
                                <option value="select_preference">Select Preference</option>
                                <option value="Preferred">Preferred</option>
                                <option value="Acceptable">Acceptable</option>
                                <option value="Nightmare">Nightmare</option>
                            </select>
                        </div>
                        <div class="inputArea">
                            <label for="notes">Notes: </label> <input type="text" id="notes" name="notes"></input>
                        </div>
                        <div class="inputArea">
                            <label for="requiresTaxException">Requires Tax Exception: *</label>
                            <select id="requiresTaxException" name="requiresTaxException">
                                <option value="select">Select option</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div class="inputArea">
                            <label for="chargesCOSalesTax">Charges CO Sales Tax: *</label>
                            <select id="chargesCOSalesTax" name="chargesCOSalesTax">
                                <option value="select">Select option</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div class="inputArea">
                            <label for="password">Password: *</label> <input type="password" id="password" name="password"/>
                        </div>
                    </form>
                </Dialog.Body>
                <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                    <Button variant="outline" backgroundColor="white" colorPalette="gray" size="sm">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button color="blue" type="submit" form="addVendor" backgroundColor="white" variant="outline" size="sm">Submit</Button>
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" backgroundColor="white" colorPalette="gray" variant="outline" />
                </Dialog.CloseTrigger>
            </Dialog.Content>
            </Dialog.Positioner>
        </Portal>
        </Dialog.Root>
    )
}

export default AddVendors;