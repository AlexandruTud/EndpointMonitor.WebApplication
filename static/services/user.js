const serverUrl = "https://localhost:7011";

export function getUserApplicationsInfo(idUser) {
  var deferred = $.Deferred();

  $.ajax({
    url: serverUrl + "/GetUserApplicationsInfo?idUser=" + idUser,
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

export function getIfIsUserApp(idUser, idApplication) {
  var deferred = $.Deferred();

  $.ajax({
    url:
      serverUrl +
      "/GetIsUserAuthor?idUser=" +
      idUser +
      "&idApplication=" +
      idApplication,
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
