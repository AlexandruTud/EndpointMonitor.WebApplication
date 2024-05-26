export class GeneralStatistics {
  constructor(
    totalApplications,
    totalEndpoints,
    totalUsers,
    totalEndpointCalls,
    stableEndpoints,
    unstableEndpoints,
    downEndpoints,
    solvedReports,
    unsolvedReports
  ) {
    this.totalApplications = totalApplications;
    this.totalEndpoints = totalEndpoints;
    this.totalUsers = totalUsers;
    this.totalEndpointCalls = totalEndpointCalls;
    this.stableEndpoints = stableEndpoints;
    this.unstableEndpoints = unstableEndpoints;
    this.downEndpoints = downEndpoints;
    this.solvedReports = solvedReports;
    this.unsolvedReports = unsolvedReports;
  }
}
