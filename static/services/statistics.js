const serverUrl = "https://localhost:7011";

export function getGeneralStatistics() {
  var deferred = $.Deferred();

  $.ajax({
    url: serverUrl + "/GetTotalNumberOfRecords",
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      deferred.resolve(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      deferred.reject(jqXHR, textStatus, errorThrown);
    },
  });

  return deferred.promise();
}

export function getEndpointsStatistics() {
  var deferred = $.Deferred();

  $.ajax({
    url: serverUrl + "/GetTotalNumberOfEndpointsByState",
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      deferred.resolve(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      deferred.reject(jqXHR, textStatus, errorThrown);
    },
  });

  return deferred.promise();
}

export function getReportsStatistics() {
  var deferred = $.Deferred();

  $.ajax({
    url: serverUrl + "/GetTotalNumberOfReportsBySolved",
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      deferred.resolve(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      deferred.reject(jqXHR, textStatus, errorThrown);
    },
  });

  return deferred.promise();
}
