import BudgetChange from 'components/BudgetChange.jsx'
import RevenueChanges from 'components/RevenueChanges.jsx'

function BudgetEvents() {
    return ( <>
        <div class="separate">
            <BudgetChange/>
        </div>
        <div>
            <RevenueChanges/>
        </div>
    </>);
}

export default BudgetEvents;