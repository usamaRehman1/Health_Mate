import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearFamilyMembers } from '../features/familyMembers/familyMembersSlice';
import { createFamilyMember, fetchFamilyMembers, removeFamilyMember as deleteFamilyMember } from '../features/familyMembers/familyMembersThunk';
import { clearVitals } from '../features/vitals/vitalsSlice';
import { createVital, fetchVitals } from '../features/vitals/vitalsThunk';
import { clearReports } from '../features/reports/reportsSlice';
import { fetchReports, uploadReport as uploadReportThunk } from '../features/reports/reportsThunk';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [fallbackUser, setFallbackUser] = useState({ name: "Zain Ahmed", email: "zain@example.com" });
  const [selectedMemberId, setSelectedMemberId] = useState('primary');
  const [loadedUserId, setLoadedUserId] = useState(null);
  const dispatch = useDispatch();
  const authenticatedUser = useSelector((state) => state.auth.user);
  const user = authenticatedUser || fallbackUser;
  const familyMemberState = useSelector((state) => state.familyMembers);
  const vitalState = useSelector((state) => state.vitals);
  const reportState = useSelector((state) => state.reports);
  const familyMembers = familyMemberState.items;
  const vitals = vitalState.items;
  const reports = reportState.items;

  useEffect(() => {
    setSelectedMemberId('primary');
    setLoadedUserId(null);
    dispatch(clearFamilyMembers());
    dispatch(clearVitals());
    dispatch(clearReports());

    if (authenticatedUser?.id) {
      const userId = authenticatedUser.id;
      dispatch(fetchFamilyMembers()).then((result) => {
        if (fetchFamilyMembers.fulfilled.match(result)) {
          setLoadedUserId(userId);
        }
      });
    }
  }, [authenticatedUser?.id, dispatch]);

  useEffect(() => {
    if (
      !authenticatedUser?.id
      || loadedUserId !== authenticatedUser.id
      || familyMemberState.status !== 'succeeded'
    ) {
      return;
    }

    const memberIds = familyMembers.map((member) => member.id);
    dispatch(fetchVitals(memberIds));
    dispatch(fetchReports(memberIds));
  }, [authenticatedUser?.id, dispatch, familyMemberState.status, familyMembers, loadedUserId]);

  const addFamilyMember = useCallback(
    (member) => dispatch(createFamilyMember(member)).unwrap(),
    [dispatch]
  );
  const removeFamilyMember = useCallback(async (memberId) => {
    await dispatch(deleteFamilyMember(memberId)).unwrap();
    setSelectedMemberId((currentMemberId) =>
      currentMemberId === memberId ? 'primary' : currentMemberId
    );
  }, [dispatch]);
  const addVital = useCallback(
    (vital) => dispatch(createVital(vital)).unwrap(),
    [dispatch]
  );
  const uploadReport = useCallback(
    (report) => dispatch(uploadReportThunk(report)).unwrap(),
    [dispatch]
  );

  return (
    <AppContext.Provider value={{
      user,
      setUser: setFallbackUser,
      reports,
      vitals,
      familyMembers,
      familyMembersLoading: familyMemberState.status === 'loading',
      familyMembersError: familyMemberState.error,
      vitalsError: vitalState.error,
      reportsError: reportState.error,
      selectedMemberId,
      setSelectedMemberId,
      addVital,
      uploadReport,
      addFamilyMember,
      removeFamilyMember,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);