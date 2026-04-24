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

        //authenticate the user
        const passwordInput = formData.get("password");
        const result = await fetch('/api/authenticate?password=' + passwordInput);
        const authenticated = await result.json();
        console.log(authenticated);
        if (!authenticated) {
            alert("Incorrect password");
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
        let res = await fetch('/api/revenueChanges');
        let revenueChanges = await res.json();
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
        //update unallocated funds
        res = await fetch('/api/subsystemBudgets');
        let subsystemBudgets = await res.json();
        for (let i = subsystemBudgets.length-1; i >= 0; i++) {
            if (subsystemBudgets[i].subsystem == "Unallocated Funds") {
                let totalBudget = parseFloat(subsystemBudgets[i].budget.replace(/,/g, ''));
                totalBudget += parseFloat(amountInput.replace(/,/g, ''));
                subsystemBudgets[i].budget = totalBudget.toLocaleString('en-US');
                subsystemBudgets[i].remaining = totalBudget.toLocaleString('en-US');
                break;
            }
        }
        res = await fetch('/api/teamBudget');
        let teamBudget = await res.json();
        for (let i = 0; i < teamBudget.length; i++) {
            if (teamBudget[i].section_name == "Funds") {
                for (let j = 0; j < teamBudget[i].items.length; j++) {
                    if (teamBudget[i].items[j].name == "Unallocated Funds") {
                        let balance = teamBudget[i].items[j].value; 
                        teamBudget[i].items[j].value = balance + parseFloat(amountInput.replace(/,/g, ''));
                    }
                }
            }
        }

        //set everything
        const subsystemBudgetsPostRes = await fetch('/api/subsystemBudgets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subsystemBudgets)
        }).then(res => {
            console.log(res);
        });
        const teamBudgetPostRes = await fetch('/api/teamBudget', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(teamBudget)
        }).then(res => {
            console.log(res);
        });
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
        
        alert("Successfuly added. Reload the page to see updates");
    }

    return (
        <Dialog.Root class="dialog">
        <Dialog.Trigger asChild>
            <Button backgroundColor="white" colorPalette="gray" variant="outline" size="sm">
            Add Revenue
            </Button>
        </Dialog.Trigger>
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
            <Dialog.Content>
                <Dialog.Header>
                <Dialog.Title>Add Revenue</Dialog.Title>
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
                        <div class="inputArea">
                            <label for="password">Password: *</label> <input type="password" id="password" name="password"/>
                        </div>
                    </form>
                </Dialog.Body>
                <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                    <Button backgroundColor="white" colorPalette="gray" variant="outline" size="sm">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button color="blue" type="submit" form="addRevenueChange" backgroundColor="white" variant="outline" size="sm">Submit</Button>
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

export default AddRevenueChange;