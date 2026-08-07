import SubsystemBudgets from 'components/SubsystemBudgets';
import IndexBalances from 'components/IndexBalances';
import TeamBudget from 'components/TeamBudget';

function BudgetsAndRevenue() {
    return (
        <>
            <div class="separate">
                <TeamBudget/>
            </div>
            <div class="separate">
                <IndexBalances/>
            </div>
                <div class="separate">
            <SubsystemBudgets/>
            </div>
        </>
    )
}

export default BudgetsAndRevenue;