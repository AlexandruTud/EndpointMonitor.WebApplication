const serverUrl = "https://localhost:7011";

export function insertReport(payload) {
  var deferred = $.Deferred();

  $.ajax({
    url: serverUrl + "/AddReport",
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

export function getNotifications(idUser) {
  var deferred = $.Deferred();

  $.ajax({
    url: serverUrl + "/GetReportByIdUser?idUser=" + idUser,
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

export function patchReport(payload) {
  var deferred = $.Deferred();

  $.ajax({
    url: serverUrl + "/UpdateReport",
    type: "PATCH",
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
