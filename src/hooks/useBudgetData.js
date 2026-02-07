import { useState, useEffect, useCallback } from 'react';
import { OrderingQueueBoard } from '@api/BoardSDK.js';
import { storage } from '@api/monday-storage';

const orderingQueueBoard = new OrderingQueueBoard();

export const useBudgetData = () => {
  const [budgets, setBudgets] = useState({});
  const [actuals, setActuals] = useState({});
  const [subsystems, setSubsystems] = useState([]);
  const [changelog, setChangelog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActuals = useCallback(async () => {
    try {
      setError(null);
      const result = await orderingQueueBoard.aggregate()
        .groupBy('subsystem')
        .sum('total', 'totalSpent')
        .countItems('itemCount')
        .execute();

      const actualsMap = {};
      result.forEach(row => {
        if (row.subsystem) {
          actualsMap[row.subsystem] = {
            spent: row.totalSpent || 0,
            count: row.itemCount || 0
          };
        }
      });
      
      setActuals(actualsMap);
    } catch (e) {
      console.error('Failed to fetch actuals:', e);
      setError(e.message || 'Failed to load spending data');
    }
  }, []);

  const fetchSubsystems = useCallback(() => {
    // Subsystem options from the Ordering Queue board schema
    const subsystemOptions = [
      'Driver Interface',
      'Aerodynamics',
      'Competition',
      'Software',
      'EV',
      'NA',
      'Chassis',
      'Manufacturing',
      'Club Operations',
      'Powertrain',
      'Sponsorship & Media',
      'Suspension',
      'Electrical'
    ];
    setSubsystems(subsystemOptions.sort());
  }, []);

  const fetchBudgets = useCallback(async () => {
    try {
      const { value } = await storage().key('subsystem_budgets').get();
      if (value) {
        setBudgets(value);
      }
    } catch (e) {
      console.error('Failed to fetch budgets:', e);
    }
  }, []);

  const fetchChangelog = useCallback(async () => {
    try {
      const { value } = await storage().key('budget_changelog').get();
      if (value) {
        setChangelog(value);
      }
    } catch (e) {
      console.error('Failed to fetch changelog:', e);
    }
  }, []);

  const saveBudgets = async (newBudgets, justification) => {
    try {
      setError(null);
      const { version } = await storage().key('subsystem_budgets').get();
      await storage().key('subsystem_budgets').version(version).set(newBudgets);
      
      // Record changes in changelog
      const changes = [];
      Object.keys(newBudgets).forEach(subsystem => {
        const oldValue = budgets[subsystem] || 0;
        const newValue = newBudgets[subsystem] || 0;
        if (oldValue !== newValue) {
          changes.push({
            date: new Date().toISOString(),
            subsystem,
            before: oldValue,
            after: newValue,
            justification,
            change: newValue - oldValue
          });
        }
      });

      if (changes.length > 0) {
        const { value: existingLog, version: logVersion } = await storage().key('budget_changelog').get();
        const updatedLog = [...(existingLog || []), ...changes];
        await storage().key('budget_changelog').version(logVersion).set(updatedLog);
        setChangelog(updatedLog);
      }

      setBudgets(newBudgets);
    } catch (e) {
      console.error('Failed to save budgets:', e);
      setError(e.message || 'Failed to save budgets');
      throw e;
    }
  };

  const refreshActuals = async () => {
    setLoading(true);
    await fetchActuals();
    setLoading(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      fetchSubsystems();
      await Promise.all([fetchBudgets(), fetchActuals(), fetchChangelog()]);
      setLoading(false);
    };
    loadData();
  }, [fetchSubsystems, fetchBudgets, fetchActuals, fetchChangelog]);

  return {
    budgets,
    actuals,
    subsystems,
    changelog,
    loading,
    error,
    saveBudgets,
    refreshActuals
  };
};
