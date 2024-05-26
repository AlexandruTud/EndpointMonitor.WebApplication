const serverUrl = "https://localhost:7011";

export function register(payload) {
  var deferred = $.Deferred();

  $.ajax({
    url: serverUrl + "/RegisterUser",
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

export function login(payload) {
  var deferred = $.Deferred();

  $.ajax({
    url: serverUrl + "/LoginUser",
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
