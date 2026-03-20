import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import 'src/App.css'

function AddBudgetChange({budgetChange, setBudgetChange}) {
    async function handleSubmit(evt) {
        evt.preventDefault();
        const form = evt.target;
        const formData = new FormData(form);
        let dateInput = formData.get("date");
        let categoryInput = formData.get("category");
        let beforeAllocationInput = formData.get("beforeAllocation");
        let afterAllocationInput = formData.get("afterAllocation");
        let explanationInput = formData.get("explanation");
        let message = "";
        if (dateInput == "") {
            message += "Must enter in the date\n";
        }
        if (categoryInput == "select_category") {
            message += "Must enter in a category\n"
        }
        if (beforeAllocationInput == "select_beforeAllocation") {
            message += "Must enter in amount before allocation\n"
        }
        if (afterAllocationInput == "select_afterAllocation") {
            message += "Must enter in amount after allocation\n"
        }
        if (explanationInput == "select_explanation") {
            message += "Must enter in an explanation\n"
        }
        if (message != "") {
            alert(message);
            return;
        }
        const bc = {
            date: dateInput,
            category: categoryInput,
            beforeAllocation: beforeAllocationInput,
            afterAllocation: afterAllocationInput,
            explanation: explanationInput
        }
        let newBudgetChange = [...budgetChange, bc];

        const postRes = await fetch('/api/budgetChange', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBudgetChange)
        }).then(res => {
            console.log(res);
        });
        console.log("Sent the information");
        const res = await fetch('/api/budgetChange');
        const data = await res.json();
        console.log(data);
        setBudgetChange(data);
        alert("Successfuly added");
    }

    return (
        <Dialog.Root class="dialog">
        <Dialog.Trigger asChild>
            <Button variant="outline" size="sm">
            Add Budget Change
            </Button>
        </Dialog.Trigger>
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
            <Dialog.Content>
                <Dialog.Header>
                <Dialog.Title>Add Budget Change</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <p>Required fields marked with *</p>
                    <form id="addBudgetChange" onSubmit={handleSubmit}>
                        <div class="inputArea">
                            <label for="date">date: *</label> <input type="text" id="date" name="date"></input>
                        </div>
                        <div class="inputArea">
                            <label for="category">category: *</label> <input type="text" id="category" name="category"></input>
                        </div>
                        <div class="inputArea">
                            <label for="beforeAllocation">Before Allocation: *</label> <input type="number" id="beforeAllocation" defaultValue="0.00" name="beforeAllocation" min="0.0"></input>
                        </div>
                        <div class="inputArea">
                            <label for="afterAllocation">After Allocation: *</label> <input type="number" id="afterAllocation" defaultValue="0.00" name="afterAllocation" min="0.0"></input>
                        </div>
                        <div class="inputArea">
                            <label for="explanation">Explanation: *</label> <input type="text" id="explanation" name="explanation"></input>
                        </div>
                    </form>
                </Dialog.Body>
                <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button color="blue" type="submit" form="addBudgetChange">Submit</Button>
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

export default AddBudgetChange;