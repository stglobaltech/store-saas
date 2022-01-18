export const refactorBranches = (branchData) => {
  const branches = [];
  branchData.forEach((branch) => {
    branches.push({ _id: branch._id, name: branch.name });
  });
  return branches;
};
