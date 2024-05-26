const serverUrl = "https://localhost:7011";

export function insertEndpoint(payload) {
  var deferred = $.Deferred();

  $.ajax({
    url: serverUrl + "/AddEndpoint",
    type: "POST",
    data: JSON.stringify(payload),
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

export function getEndpoints(idApplication) {
  var deferred = $.Deferred();

  $.ajax({
    url: serverUrl + "/GetEndpoint?idApplication=" + idApplication,
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

export function deleteEndpointRequest(idEndpoint) {
  var deferred = $.Deferred();

  $.ajax({
    url: serverUrl + "/DeleteEndpoint?idEndpoint=" + idEndpoint,
    type: "DELETE",
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

export function getEndpointHistoryByHours(idEndpoint, hours) {
  var deferred = $.Deferred();

  $.ajax({
    url:
      serverUrl +
      "/GetEndpointHistoryByHours?idEndpoint=" +
      idEndpoint +
      "&hours=" +
      hours,
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

export function getEndpointHistoryById(idEndpoint) {
  var deferred = $.Deferred();

  $.ajax({
    url: serverUrl + "/GetEndpointHistoryById?idEndpoint=" + idEndpoint,
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
