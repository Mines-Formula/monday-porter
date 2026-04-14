import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import 'src/App.css'

function AddRevenueChange({indexes, setIndexes}) {
    async function handleSubmit(evt) {
        //manage data input
        evt.preventDefault();
        const form = evt.target;
        const formData = new FormData(form);
        let message = "";
        let amountInput = formData.get("amount");
        if (amountInput == "0.00") {
            message += "Must enter in the amount added\n";
        }
        let indexInput = formData.get("index");
        if (indexInput == "select_preference") {
            message += "Must select the index\n";
        }
        let descriptionInput = formData.get("description");
        if (descriptionInput == "") {
            message += "Must enter in the description\n";
        }
        if (message != "") {
            alert(message);
            return;
        }

        //get the date and update revenue changes
        const d = new Date();
        const dateInput = (d.getMonth() + 1) +"/" +(d.getDate()) + "/" + (d.getFullYear());
        const revenueChange = {
            date: dateInput,
            amount: amountInput,
            index: indexInput,
            description: descriptionInput
        }
        const res = await fetch('/api/revenueChanges');
        const revenueChanges = await res.json();
        let newRevenueChanges = [...revenueChanges, revenueChange];
        const revenuePostRes = await fetch('/api/revenueChanges', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRevenueChanges)
        }).then(res => {
            console.log(res);
        });
        console.log("Sent the information");

        //update index balances
        let newIndexes = indexes;
        for (let i = 0; i < indexes.length; i++) {
            let index = newIndexes[i];
            if (index.index == indexInput) {
                const oldRevenue = index.revenue;
                const oldBalance = index.balance;
                const newRevenue = oldRevenue + parseFloat(amountInput);
                const newBalance = oldBalance + parseFloat(amountInput);
                newIndexes[i].revenue = newRevenue;
                newIndexes[i].balance = newBalance;
            }
        }
        const indexPostRes = await fetch('/api/indexBalances', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newIndexes)
        }).then(res => {
            console.log(res);
        });
        const resIndex = await fetch('/api/indexBalances');
        const data = await resIndex.json();
        console.log(data);
        setIndexes(data);
        
        alert("Successfuly changed");
    }

    return (
        <Dialog.Root class="dialog">
        <Dialog.Trigger asChild>
            <Button variant="outline" size="sm">
            Change Revenue
            </Button>
        </Dialog.Trigger>
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
            <Dialog.Content>
                <Dialog.Header>
                <Dialog.Title>Change Revenue</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <p>Required fields marked with *</p>
                    <form id="addRevenueChange" onSubmit={handleSubmit}>
                        <div class="inputArea">
                            <label for="amount">Amount added: *</label> <input type="number" id="amount" step=".01" defaultValue="0.00" name="amount" min="0.00"></input>
                        </div>
                        <div class="inputArea">
                            <label for="index">Index: *</label>
                            <select id="index" name="index">
                                <option value="select_preference">Select Index</option>
                                <option value="383306">383306 - SAIL</option>
                                <option value="610824">610824 - Foundation</option>
                            </select>
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

export default AddRevenueChange;