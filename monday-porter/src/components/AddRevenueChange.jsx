import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import 'src/App.css'

function AddVendors({revenueChanges, setRevenueChanges}) {
    async function handleSubmit(evt) {
        evt.preventDefault();
        const form = evt.target;
        const formData = new FormData(form);
        let dateInput = formData.get("date");
        let message = "";
        if (dateInput == "") {
            message += "Must enter in the date\n";
        }
        let amountInput = formData.get("amount");
        if (amountInput == "0.00") {
            message += "Must enter in the amount\n";
        }
        let indexInput = formData.get("index");
        if (indexInput == "") {
            message += "Must enter in the index\n";
        }
        let descriptionInput = formData.get("description");
        if (descriptionInput == "") {
            message += "Must enter in the description\n";
        }
        if (message != "") {
            alert(message);
            return;
        }
        const revenueChange = {
            date: dateInput,
            amount: amountInput,
            index: indexInput,
            description: descriptionInput
        }
        let newRevenueChanges = [...revenueChanges, revenueChange];
        
        const postRes = await fetch('/api/revenueChanges', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRevenueChanges)
        }).then(res => {
            console.log(res);
        });
        console.log("Sent the information");
        const res = await fetch('/api/revenueChanges');
        const data = await res.json();
        console.log(data);
        setRevenueChanges(data);
        
        alert("Successfuly added");
    }

    return (
        <Dialog.Root class="dialog">
        <Dialog.Trigger asChild>
            <Button variant="outline" size="sm">
            Add Revenue Change
            </Button>
        </Dialog.Trigger>
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
            <Dialog.Content>
                <Dialog.Header>
                <Dialog.Title>Add Revenue Change</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <p>Required fields marked with *</p>
                    <form id="addRevenueChange" onSubmit={handleSubmit}>
                        <div class="inputArea">
                            <label for="date">Date: *</label> <input type="date" id="date" name="date"></input>
                        </div>
                        <div class="inputArea">
                            <label for="amount">Amount: *</label> <input type="number" id="amount" defaultValue="0.00" name="amount" min="0.00"></input>
                        </div>
                        <div class="inputArea">
                            <label for="index">Index: *</label> <input type="number" id="index" name="index"></input>
                        </div>
                        <div class="inputArea">
                            <label for="description">Description: *</label> <input type="text" id="description" name="description"></input>
                        </div>
                    </form>
                </Dialog.Body>
                <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button color="blue" type="submit" form="addRevenueChange">Submit</Button>
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
                </Dialog.CloseTrigger>
            </Dialog.Content>
            </Dialog.Positioner>
        </Portal>
        </Dialog.Root>
    )
}

export default AddVendors;