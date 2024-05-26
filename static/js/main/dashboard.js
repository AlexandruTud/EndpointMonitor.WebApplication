import {
  getUserApplicationsInfo,
  getIfIsUserApp,
} from "../../services/user.js";
import {
  insertApplication,
  getApplications,
  getApplicationById,
  patchApplication,
  deleteApplication,
} from "../../services/applications.js";
import {
  insertEndpoint,
  getEndpoints,
  deleteEndpointRequest,
  getEndpointHistoryByHours,
  getEndpointHistoryById,
} from "../../services/endpoints.js";
import {
  getGeneralStatistics,
  getEndpointsStatistics,
  getReportsStatistics,
} from "../../services/statistics.js";
import {
  insertReport,
  getNotifications,
  patchReport,
} from "../../services/report.js";
import { register, login } from "../../services/auth.js";
import "../../interfaces/endpoint.js";
import "../../interfaces/generalStatistics.js";
import { Endpoint } from "../../interfaces/endpoint.js";
import { GeneralStatistics } from "../../interfaces/generalStatistics.js";

var authArea,
  logout,
  myApplicationsDashboard,
  notifications,
  history,
  information,
  logout2,
  myApplicationsDashboard2,
  notifications2,
  history2,
  information2;
var sidebar, closeBtn;
var homeSection,
  commentsSection,
  historySection,
  settingsSection,
  myApplications,
  addPopup,
  endpointSection;
var cards, myApplicationsCards;

var applicationTitle,
  applicationDescription,
  applicationImage,
  addApplicationBtn;

var currentApplicationId, currentEndpointId, currentReportId;
var endpointsWrapper;
var endpointUrl, endpointType;
var getEndpoint, postEndpoint, putEndpoint, patchEndpoint, deleteEndpoint;
var endpointStatisticsHours, endpointStatisticsUnit;

var totalProjects,
  totalEndpoints,
  endpointsStable,
  endpointsUnstable,
  endpointsDown;

var personalStatsEmail,
  totalProjectsLabel,
  totalEndpointsLabel,
  endpointsStableLabel,
  endpointsUnstableLabel,
  endpointsDownLabel;

var notification, notificationWrapper, notificationBadge;

function updatePersonalStatistics() {
  totalProjectsLabel.text(totalProjects);
  totalEndpointsLabel.text(totalEndpoints);
  endpointsStableLabel.text(endpointsStable);
  endpointsUnstableLabel.text(endpointsUnstable);
  endpointsDownLabel.text(endpointsDown);
}

// Endpoints charts
var endpointChart;
var endpointChartX = ["Successful calls", "Unsuccessful calls"];
var endpointChartY = [0, 0];
var endpointChartBarColors = ["#00aba9", "#b91d47"];

// General statistics
var generalStatistics = new GeneralStatistics(0, 0, 0, 0);
var totalApplicationsLabel,
  totalEndpointsGeneralLabel,
  totalUsersLabel,
  totalEndpointCallsLabel;

var generalEndpoints, configGeneralEndpoints, generalEndpointsChart;
var generalReports, configGeneralReports, generalReportsChart;

var reportMentions;

export function getNotificationss(idReceiver) {
  var deferred = $.Deferred();

  $.ajax({
    url: "https://localhost:7011/api/Notification/GetNotifications?idReceiver=" + idReceiver,
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

function loadNotifications() {
  var userIdAuth = parseInt($.cookie("UserId"));

  if (userIdAuth === undefined) userIdAuth = 5;

  getNotificationss(userIdAuth).done(function (data) {
    if (data.length > 0) {
      var element = $("#notificationWrapper").children().eq(0).clone();
      $("#notificationWrapper").empty();
      $("#notificationWrapper").append(element);
      notificationBadge.attr("hidden", false);
      if (data.length < 10) notificationBadge.text(data.length);
      else notificationBadge.text("");

      for (let i = 0; i < data.length; i++) {
        var element = notification.clone();

        element.attr("id", "notification" + data[i].IdNotification);
        element.children().eq(0).children().eq(0).text(data[i].SenderEmail);
        element.children().eq(1).children().eq(0).text(data[i].Text);
        element
          .children()
          .eq(1)
          .children()
          .eq(1)
          .children()
          .eq(0)
          .children()
          .eq(0)
          .text(data[i].ApplicationName);

        element
          .children()
          .eq(1)
          .children()
          .eq(1)
          .children()
          .eq(1)
          .children()
          .eq(0)
          .text(data[i].EndpointURL);

        element
          .children()
          .eq(1)
          .children()
          .eq(1)
          .children()
          .eq(2)
          .children()
          .eq(0)
          .text(data[i].EndpointType);

        element
          .children()
          .eq(1)
          .children()
          .eq(2)
          .text(data[i].DateCreated.replace("T", " ").substring(0, data[i].DateCreated.indexOf(".")));

        element
          .children()
          .eq(0)
          .children()
          .eq(1)
          .children()
          .eq(0)
          .click(async function () {

            console.log(data[i].ReportId);
            patchReport({
              idApplicationReport: data[i].ReportId,
              markedAsSolved: 1,
            })

            try {


              await deleteNotification(data[i].IdNotification);

              const historyPp = {
                idEndpoint: data[i].IdEndpoint,
                idUser: userIdAuth,
                code: 200,
                mentions: "Problem solved",
              };
              console.log(data[i].IdEndpoint);
              insertEndpointHistory(historyPp)
                .done(function () {
                  console.log("Endpoint history added successfully.");
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                  console.log("Failed to add endpoint history: ", errorThrown);
                });


              $("#notification" + data[i].IdNotification).remove();

              var notificationsCount = notificationWrapper.children().length - 1;
              if (notificationsCount > 0 && notificationsCount < 10) {
                notificationBadge.text(notificationsCount);
              } else if (notificationsCount == 0) {
                notificationBadge.remove();
              } else {
                notificationBadge.text("9+");
              }
            } catch (error) {
              console.error("Failed to delete notification:", error);
              alert("An error occurred while deleting the notification.");
            }



          });



        element.attr("hidden", false);
        notificationWrapper.append(element);
      }

      var notificationsCount = notificationWrapper.children().length - 1;
      if (notificationsCount > 0 && notificationsCount < 10) {
        notificationBadge.text(notificationsCount);
        notificationBadge.attr("hidden", false);
      } else if (notificationsCount == 0) {
        notificationBadge.attr("hidden", true);
      } else {
        notificationBadge.text("9+");
        notificationBadge.attr("hidden", false);
      }
    }
  });
}


async function deleteNotification(idNotification) {
  const response = await fetch(`https://localhost:7011/api/Notification/DeleteNotification?idNotification=${idNotification}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Failed to delete notification");
  }

  return await response.text();
}




function checkLoginStatus() {
  var userId = $.cookie("UserId");

  if (userId !== undefined) {
    authArea.attr("hidden", true);
    getUserApplicationsInfo(parseInt(userId)).done(function (data) {
      personalStatsEmail.text(data[0].email);
      totalProjects = data[0].nrOfApplications;
      totalEndpoints = data[0].nrOfEndpoints;
      endpointsStable = data[0].nrOfEndpointsStable;
      endpointsUnstable = data[0].nrOfEndpointsUnstable;
      endpointsDown = data[0].nrOfEndpointsDown;
      updatePersonalStatistics();
      $('#youHave').hide();
    });
  } else {
    logout.attr("hidden", true);
    myApplicationsDashboard.attr("hidden", true);
    notifications.attr("hidden", true);
    history.attr("hidden", true);
    information.attr("hidden", true);
    logout2.attr("hidden", true);
    myApplicationsDashboard2.attr("hidden", true);
    notifications2.attr("hidden", true);
    history2.attr("hidden", true);
    information2.attr("hidden", true);
    $('#comment_text').hide();
    $('.tooltipCom').hide();
    $('#submitCom').hide();
    $('#youHave').show();
  }
}

var chartInstance = null;
var selectedValue = '24h';

function updateChart(selectedValue, applicationId) {


  var endpointUrl = 'https://localhost:7011/GetReport?idApplication=' + applicationId;

  if (selectedValue === '24h') {
    endpointUrl += '&timeRange=24h';
  } else if (selectedValue === '1m') {
    endpointUrl += '&timeRange=1m';
  } else if (selectedValue === '1y') {
    endpointUrl += '&timeRange=1y';
  }

  if (selectedValue === '24h') {
    var now = new Date();
    var twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    endpointUrl += '&startDate=' + twentyFourHoursAgo.toISOString();
  } else if (selectedValue === '1m') {
    var oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    endpointUrl += '&startDate=' + oneMonthAgo.toISOString();
  } else if (selectedValue === '1y') {
    var oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    endpointUrl += '&startDate=' + oneYearAgo.toISOString();
  }

  $.ajax({
    url: endpointUrl,
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      if (chartInstance) {
        chartInstance.destroy();
      }

      var labels = [];
      var reportCounts = [];

      data.forEach(function (report) {
        var reportDate = new Date(report.reportDateCreated);
        var label;

        if (selectedValue === '24h') {
          label = reportDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (selectedValue === '1m') {
          label = reportDate.toLocaleDateString();
        } else if (selectedValue === '1y') {
          label = reportDate.toLocaleString('default', { month: 'short' }) + ' ' + reportDate.getFullYear();
        }

        var labelIndex = labels.indexOf(label);
        if (labelIndex === -1) {
          labels.push(label);
          reportCounts.push(1);
        } else {
          reportCounts[labelIndex]++;
        }
      });

      var ctx = document.getElementById('reportChart').getContext('2d');
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Number of Reports',
            data: reportCounts,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: selectedValue === '1y' ? 'month' : 'day',
                displayFormats: {
                  day: 'D MMM YYYY',
                  month: 'MMM YYYY'
                }
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true
              },
              scaleLabel: {
                display: true,
                labelString: 'Number of Reports'
              }
            }]
          }
        }
      });
    },
    error: function (xhr, status, error) {
      console.error('Error:', status, error);
    }
  });
}




function addCard(idUserAuthor, application) {
  var card;
  if (idUserAuthor == 0) {
    card = $("#card").clone();
    card.attr("id", "card" + application.idApplication);
  } else {
    card = $("#myApplicationsCard").clone();
    card.attr("id", "myApplicationsCard" + application.idApplication);
  }

  console.log("applicationState:", application.applicationState);


  if (application.applicationState === "2") {
    card.children().eq(0).css("background-color", "#ffc107");
    card.children().eq(0).children().eq(0).html("Unstable");
  } else if (application.applicationState === "3") {
    card.children().eq(0).css("background", "red");
    card.children().eq(0).children().eq(0).text("Down");
  } else if (application.applicationState === "1") {
    card.children().eq(0).css("background", "green");
    card.children().eq(0).children().eq(0).text("Stable");
  }

  card
    .children()
    .eq(1)
    .children()
    .eq(0)
    .attr("src", "../../static/images/main/applications/" + application.image);

  card.children().eq(2).children().eq(0).text(application.name);
  card.children().eq(2).children().eq(1).text(application.description);

  const maskedEmail = maskEmail(application.userEmail);
  card
    .children()
    .eq(2)
    .children()
    .eq(2)
    .children()
    .eq(0)
    .text(application.userEmail);

  if (application.userEmail == null || application.userEmail === undefined) {
    card
      .children()
      .eq(2)
      .children()
      .eq(2)
      .children()
      .eq(0)
      .text(personalStatsEmail.text());
  }

  card
    .children()
    .eq(2)
    .children()
    .eq(2)
    .children()
    .eq(1)
    .text(
      application.dateCreated
        .replace("T", " ")
        .substring(0, application.dateCreated.indexOf("."))
    );

  card.attr("hidden", false);

  if (idUserAuthor == 0) {
    cards.append(card);


    card
      .children()
      .eq(2)
      .children()
      .eq(3)
      .click(function () {
        homeSection.hide();
        myApplications.hide();
        endpointSection.show();

        $("#filterEndpoints").val("0");

        currentApplicationId = application.idApplication;

        var userId = parseInt($.cookie("UserId"));

        getIfIsUserApp(userId, currentApplicationId).done(function (data) {
          loadEndpoints(application.idApplication, data[0].isAuthor);
        });
      });
  } else {

    card
      .children()
      .eq(2)
      .children()
      .eq(3)
      .children()
      .eq(0)
      .click(function () {
        myApplications.hide();
        endpointSection.show();

        $("#filterEndpoints").val("0");

        currentApplicationId = application.idApplication;
        loadEndpoints(application.idApplication, true);
      });

    card
      .children()
      .eq(2)
      .children()
      .eq(3)
      .children()
      .eq(1)
      .click(function () {
        currentApplicationId = application.idApplication;
        $("#myModal").show();
      });




    myApplicationsCards.append(card);
  }

  card.children().eq(2).children().eq(4).click(function () {
    currentApplicationId = application.idApplication;
    console.log("Current application ID:", currentApplicationId);
    updateChart(selectedValue, application.idApplication);
  });

  card.children().eq(2).children().eq(5).click(function () {
    currentApplicationId = application.idApplication;
    console.log("Current application ID:", currentApplicationId);
    loadComments(application.idApplication);
    $('#submitCom').click(function () {
      var commentText = $('#comment_text').val();

      var userId = parseInt($.cookie("UserId"));

      console.log(currentApplicationId);


      if (userId === undefined) {
        console.log("you are not auth");
        alert("You are not authenticated");
      }

      insertComment(userId, currentApplicationId, commentText);
    });
  });
}

function loadComments(idApplication) {

  $.ajax({
    url: `https://localhost:7011/api/Comments/GetComments`,
    method: 'GET',
    data: { IdApplication: idApplication },
    success: function (response) {
      $('#output_containerCom').empty();

      response.forEach(function (comment) {
        const commentHtml = `
                  <div class="commentCom">
                      <div class="comment-headerCom">
                          <p class="usernameCom">${comment.Email}</p>
                      </div>
                      <div class="comment-textCom">
                          <p>${comment.Comment}</p>
                      </div>
                      <div class="comment-dateCom">
                          <p id="dateCom">${new Date(comment.DateComented).toLocaleString()}</p>
                      </div>
                  </div>
              `;
        $('#output_containerCom').append(commentHtml);
      });

      var numberOfComments = response.length;
      $('#numberOfComments').text(numberOfComments);
    },
    error: function (error) {
      console.log('Error fetching comments:', error);
    }
  });
}

function insertComment(userId, idApplication, commentText) {
  var data = {
    IdUser: userId,
    IdApplication: idApplication,
    Comment: commentText
  };

  $.ajax({
    url: 'https://localhost:7011/api/Comments/InsertComment',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function (response) {
      console.log(response);
      loadComments(idApplication);
    },
    error: function (error) {
      console.log('Error inserting comment:', error);
    }
  });
}







function maskEmail(email) {
  if (!email) return "";

  const [localPart, domain] = email.split("@");
  if (localPart.length <= 2) {
    return email;
  }

  const maskedLocalPart = localPart[0] + "*".repeat(localPart.length - 2) + localPart[localPart.length - 1];
  return maskedLocalPart + "@" + domain;
}



async function getReportsByApplicationId(applicationId) {
  try {
    const response = await fetch(`https://localhost:7011/GetReport?idApplication=${applicationId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while fetching endpoint data:", error);
    throw error;
  }
}


function deleteCard() {
  deleteApplication(currentApplicationId)
    .done(function (data) {
      $("#myModal").hide();
      $("#myApplicationsCard" + currentApplicationId).remove();
      currentApplicationId = 0;
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    });
}

function onLogout() {
  document.cookie = "UserId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "http://127.0.0.1:5500/templates/main/dashboard.html";
}

function loadCards(idUserAuthor) {
  getApplications(idUserAuthor)
    .done(function (data) {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        addCard(idUserAuthor, data[i]);
      }

      if (idUserAuthor == 0) $("#card").attr("hidden", true);
      else $("#myApplicationsCard").attr("hidden", true);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
      if (idUserAuthor == 0) $("#card").remove();
      else $("#myApplicationsCard").remove();
    });
}

function addEndpointCard(idEndpoint, endpoint, ownApplication) {
  var card;

  if (endpoint.idType == 1) card = getEndpoint.clone();
  else if (endpoint.idType == 2) card = postEndpoint.clone();
  else if (endpoint.idType == 3) card = putEndpoint.clone();
  else if (endpoint.idType == 4) card = patchEndpoint.clone();
  else if (endpoint.idType == 5) card = deleteEndpoint.clone();

  if (ownApplication) card.attr("id", "myApplicationsEndpoint" + idEndpoint);
  else card.attr("id", "endpoint" + idEndpoint);

  if (endpoint.endpointState === "Unstable")
    card
      .children()
      .eq(1)
      .children()
      .eq(0)
      .children()
      .eq(1)
      .css("background", "#ffc107");
  else if (endpoint.endpointState === "Down")
    card
      .children()
      .eq(1)
      .children()
      .eq(0)
      .children()
      .eq(1)
      .css("background", "red");

  card
    .children()
    .eq(1)
    .children()
    .eq(1)
    .children()
    .eq(0)
    .text("URL: " + endpoint.url);

  if (endpoint.dateCreated != null)
    card
      .children()
      .eq(1)
      .children()
      .eq(1)
      .children()
      .eq(2)
      .text("Date created: " + endpoint.dateCreated);
  else {
    var date = new Date();

    card
      .children()
      .eq(1)
      .children()
      .eq(1)
      .children()
      .eq(2)
      .text(
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds()
      );
  }

  card
    .children()
    .eq(1)
    .children()
    .eq(0)
    .children()
    .eq(1)
    .children()
    .eq(0)
    .text(endpoint.endpointState);

  if (ownApplication) {
    card.children().eq(1).children().eq(5).remove();

    $('#addEndpoint').show();

    card
      .children()
      .eq(1)
      .children()
      .eq(2)
      .click(function () {
        currentEndpointId = idEndpoint;
        $("#viewStatisticsChoice").show();
      });

    card
      .children()
      .eq(1)
      .children()
      .eq(3)
      .click(function () {
        currentEndpointId = idEndpoint;
        getEndpointHistoryById(currentEndpointId).done(function (data) {
          var element = $("#historyEndpoint").clone();
          $("#historyWrapper").empty();
          $("#historyWrapper").append(element);

          for (let i = 0; i < data.length; i++) {
            var element = $("#historyEndpoint").clone();

            element
              .children()
              .eq(0)
              .children()
              .eq(0)
              .text(
                data[i].dateCreated
                  .replace("T", " ")
                  .substring(0, data[i].dateCreated.indexOf("."))
              );

            if (data[i].code != 200 && data[i].code != 302) {
              element
                .children()
                .eq(0)
                .children()
                .eq(1)
                .css("background", "red");
              element
                .children()
                .eq(0)
                .children()
                .eq(1)
                .text("Code: " + data[i].code);
            }

            element.attr("hidden", false);

            $("#historyWrapper").append(element);
          }
        });
      });

    card
      .children()
      .eq(1)
      .children()
      .eq(4)
      .click(function () {
        currentEndpointId = idEndpoint;
      });
  } else {
    card.children().eq(1).children().eq(2).remove();
    card.children().eq(1).children().eq(2).remove();
    card.children().eq(1).children().eq(2).remove();

    $('#addEndpoint').hide();

    card
      .children()
      .eq(1)
      .children()
      .eq(2)
      .click(function () {
        currentEndpointId = idEndpoint;
        $("#reportPopup").show();
      });
  }

  card.attr("hidden", false);

  endpointsWrapper.append(card);
}



function convertTypeStrToInt(typeStr) {
  if (typeStr === "GET") return 1;
  else if (typeStr === "POST") return 2;
  else if (typeStr === "PUT") return 3;
  else if (typeStr === "PATCH") return 4;
  else if (typeStr === "DELETE") return 5;
  else return 0;
}

function loadEndpoints(idApplication, ownApplication) {
  getEndpoints(idApplication).done(function (data) {
    endpointsWrapper.empty();

    for (let i = 0; i < data.length; i++)
      addEndpointCard(
        data[i].idEndpoint,
        new Endpoint(
          data[i].url,
          convertTypeStrToInt(data[i].type),
          idApplication,
          data[i].dateCreated
            .replace("T", " ")
            .substring(0, data[i].dateCreated.indexOf(".")),
          data[i].endpointState
        ),
        ownApplication
      );
  });
}

async function onFilterEndpoints(event) {
  var filter = event.target.value;

  endpointsWrapper.children().each(function (index, card) {
    var text = $(card)
      .children()
      .eq(1)
      .children()
      .eq(0)
      .children()
      .eq(1)
      .children()
      .eq(0)
      .text();

    if (text === "Stable" && (filter == 2 || filter == 3)) {
      $(card).hide();
    } else if (text === "Unstable" && (filter == 1 || filter == 3)) {
      $(card).hide();
    } else if (text === "Down" && (filter == 1 || filter == 2)) {
      $(card).hide();
    } else {
      $(card).show();
    }
  });
}

async function addEndpoint() {
  var url = $("#endpointUrl").val();
  var idType = parseInt($("#endpointType").val());

  if (url < 3) {
    alert("Type a valid url for the endpoint!");
    return;
  }

  var idUser = $.cookie("UserId");

  var endpoint = new Endpoint(url, idType, currentApplicationId, null);

  insertEndpoint({
    url: endpoint.url,
    idType: endpoint.idType,
    idApplication: endpoint.idApplication,
  })
    .done(function (data) {
      var newEndpointId = data;

      addEndpointCard({ id: newEndpointId, ...endpoint }, endpoint, true);

      $("#endpointUrl").val("");

      totalEndpoints++;
      endpointsStable++;
      updatePersonalStatistics();

      const historyP = {
        idEndpoint: newEndpointId,
        idUser: idUser,
        code: 200,
        mentions: "New endpoint stable",
      };
      console.log(newEndpointId);
      insertEndpointHistory(historyP)
        .done(function () {
          console.log("Endpoint history added successfully.");
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          console.log("Failed to add endpoint history: ", errorThrown);
        });

    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    });


}

async function cancelEndpointStatisticsModal() {
  $("#viewStatisticsChoice").hide();
  endpointStatisticsHours.val("");
  endpointStatisticsUnit.val("1");
  $("#viewStatistics").hide();
}

function countEndpointCalls(data) {
  var successful = 0,
    unsuccessful = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].code == 200 || data[i].code == 302) successful++;
    else unsuccessful++;
  }

  return [successful, unsuccessful];
}

async function showEndpointStatistics() {
  if ($("#endpointStatisticsHours").val() === "") {
    alert("Insert a valid number for hours!");
    return;
  }

  var hours = parseInt($("#endpointStatisticsHours").val());

  var unit = parseInt($("#endpointStatisticsUnit").val());
  if (unit == 2) hours *= 24;

  getEndpointHistoryByHours(currentEndpointId, hours).done(function (data) {
    if (data.length == 0) {
      alert("There is no data to be shown in the interval selected!");
    } else {
      var count = countEndpointCalls(data);

      endpointChartY = count;

      if (endpointChart != null) endpointChart.destroy();

      endpointChart = new Chart("myChart", {
        type: "pie",
        data: {
          labels: endpointChartX,
          datasets: [
            {
              backgroundColor: endpointChartBarColors,
              data: endpointChartY,
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: "Statistics",
          },
        },
      });

      var ok = 0,
        notOk = 0;

      for (let i = 0; i < data.length; i++) {
        if (data[i].code == 200 || data[i].code == 302) ok++;
        else notOk++;

        if (ok > 0 && notOk > 0) break;
      }

      if (ok > 0 && notOk > 0) {
        $("#endpointStatisticsState").css("background", "#ffc107");
        $("#endpointStatisticsState").text("Unstable");
      } else if (notOk == 0) {
        $("#endpointStatisticsState").css("background", "green");
        $("#endpointStatisticsState").text("Stable");
      } else if (ok == 0) {
        $("#endpointStatisticsState").css("background", "red");
        $("#endpointStatisticsState").text("Down");
      }

      $("#viewStatisticsChoice").hide();
      $("#viewStatistics").show();
    }
  });
}


async function showReportModal() {
  $("#reportPopup").show();
}

async function cancelReportModal() {
  $("#reportPopup").hide();
}

// Function to insert a notification
async function insertNotification(notificationPayload) {
  const response = await fetch("https://localhost:7011/api/Notification/InsertNotification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(notificationPayload)
  });

  if (!response.ok) {
    throw new Error("Failed to insert notification");
  }

  return await response.text();
}


async function addReport() {
  if ($("#reportMentions").val().length < 3) {
    alert("Insert a valid comment!");
    return;
  }

  var idUser = $.cookie("UserId");
  if (idUser === undefined) idUser = 5;

  const reportPayload = {
    idApplication: currentApplicationId,
    idEndpoint: currentEndpointId,
    idUser: idUser,
    mentions: $("#reportMentions").val(),
  };

  try {
    await insertReport(reportPayload);

    const historyPayload = {
      idEndpoint: currentEndpointId,
      idUser: idUser,
      code: parseInt($("#codeHistory").val()),
      mentions: $("#reportMentions").val(),
    };

    await insertEndpointHistory(historyPayload);

    await patchApplication({
      idApplication: currentApplicationId,
      idState: 2,
    });

    $("#endpoint" + currentEndpointId)
      .children()
      .eq(1)
      .children()
      .eq(0)
      .children()
      .eq(1)
      .css("background", "rgb(152, 152, 0)");

    $("#endpoint" + currentEndpointId)
      .children()
      .eq(1)
      .children()
      .eq(0)
      .children()
      .eq(1)
      .children()
      .eq(0)
      .text("Unstable");

    const applicationData = await getApplicationByIdd(currentApplicationId);
    const applicationName = applicationData[0].name;
    const appIdReceiver = applicationData[0].idUser;

    const endpointData = await getEndpointByApplicationId(currentApplicationId);
    const endpointURL = endpointData[0].url;

    const notificationPayload = {
      idReceiver: appIdReceiver,
      idSender: idUser,
      text: $("#reportMentions").val(),
      idApplication: currentApplicationId,
      idEndpoint: currentEndpointId
    };

    await insertNotification(notificationPayload);

    // Send email
    const applicationEmail = await getEmailById(currentApplicationId);
    const emailSubject = encodeURIComponent(`Report for your application ${applicationName}`);
    const emailBody = encodeURIComponent(`You have a report at application: ${applicationName} and at endpoint: ${endpointURL}`);
    const emailUrl = buildEmailUrl(applicationEmail, emailSubject, emailBody);

    await fetch(emailUrl, {
      method: 'POST',
      headers: {
        'accept': '/'
      }
    });

    $("#reportMentions").val("");
    $("#reportPopup").hide();

  } catch (error) {
    console.error("An error occurred:", error);
    alert("An error occurred while reporting.");
  }
}


async function getEndpointByApplicationId(applicationId) {
  try {
    const response = await fetch(`https://localhost:7011/GetEndpoint?idApplication=${applicationId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while fetching endpoint data:", error);
    throw error;
  }
}


async function getEmailById(applicationId) {
  try {
    const response = await fetch(`https://localhost:7011/GetEmailByID?UserId=${applicationId}`);
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    } else {
      throw new Error("No email found for the given applicationId.");
    }
  } catch (error) {
    console.error("Error while fetching email:", error);
    throw error;
  }
}

async function getApplicationByIdd(applicationId) {
  try {
    const response = await fetch(`https://localhost:7011/GetApplicationById?idApplication=${applicationId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while fetching application data:", error);
    throw error;
  }
}


function buildEmailUrl(to, subject, body) {
  const emailUrl = `https://localhost:7011/Email/SendMail?to=${to}&subject=${subject}&body=${body}`;
  return emailUrl;
}

export function insertEndpointHistory(payload) {
  var deferred = $.Deferred();

  $.ajax({
    url: 'https://localhost:7011/AddEndpointHistory',
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




async function updateGeneralStatistics() {
  totalApplicationsLabel.text(generalStatistics.totalApplications);
  totalEndpointsGeneralLabel.text(generalStatistics.totalEndpoints);
  totalUsersLabel.text(generalStatistics.totalUsers);
  totalEndpointCallsLabel.text(generalStatistics.totalEndpointCalls);

  generalEndpoints.datasets[0].data = [
    generalStatistics.stableEndpoints,
    generalStatistics.unstableEndpoints,
    generalStatistics.downEndpoints,
  ];

  generalReports.datasets[0].data = [
    generalStatistics.solvedReports,
    generalStatistics.unsolvedReports,
  ];

  if (generalEndpointsChart != null) generalEndpointsChart.destroy();

  generalEndpointsChart = new Chart(
    document.getElementById("myChartFirst"),
    configGeneralEndpoints
  );

  if (generalReportsChart != null) generalReportsChart.destroy();

  generalReportsChart = new Chart(
    document.getElementById("myChartSecond"),
    configGeneralReports
  );
}

async function loadStatistics() {
  getGeneralStatistics().done(function (data) {
    generalStatistics.totalApplications = data[0].totalApplications;
    generalStatistics.totalEndpoints = data[0].totalEndpoints;
    generalStatistics.totalUsers = data[0].totalUsers;
    generalStatistics.totalEndpointCalls = data[0].totalEndpointHistoryRecords;

    getEndpointsStatistics().done(function (data) {
      generalStatistics.stableEndpoints = data[0].totalStableEndpoints;
      generalStatistics.unstableEndpoints = data[0].totalUnstableEndpoints;
      generalStatistics.downEndpoints = data[0].totalDownEndpoints;

      getReportsStatistics().done(function (data) {
        generalStatistics.solvedReports = data[0].totalSolvedReports;
        generalStatistics.unsolvedReports = data[0].totalUnsolvedReports;

        updateGeneralStatistics();
      });
    });
  });
}

async function onDeleteEndpoint() {
  deleteEndpointRequest(currentEndpointId).done(function () {
    $("#myApplicationsEndpoint" + currentEndpointId).remove();
    cancelDeleteEndpointModal();
    currentEndpointId = 0;
  });
}

async function searchCards(event) {
  var text = event.target.value;
  cards.children().each(function (index, card) {
    if (
      !$(card)
        .children()
        .eq(2)
        .children()
        .eq(0)
        .text()
        .toLowerCase()
        .includes(text.toLowerCase()) &&
      !$(card)
        .children()
        .eq(2)
        .children()
        .eq(1)
        .text()
        .toLowerCase()
        .includes(text.toLowerCase())
    ) {
      if ($(card).attr("id") !== "card") {
        $(card).attr("hidden", true);
      }
    } else {
      if ($(card).attr("id") !== "card") {
        $(card).attr("hidden", false);
      }
    }
  });
}

async function searchEndpoints(event) {
  var text = event.target.value.toLowerCase();

  $(".method:visible").each(function (index, method) {
    var operation = $(method).find(".operation");
    var url = operation.find("ul li:first-child").text().toLowerCase();
    var parameters = operation.find("ul li:nth-child(2)").text().toLowerCase();

    if (
      !url.includes(text) &&
      !parameters.includes(text)
    ) {
      $(method).attr("hidden", true);
    } else {
      $(method).removeAttr("hidden");
    }
  });
}



async function searchMyApplicationsCards(event) {
  var text = event.target.value;
  myApplicationsCards.children().each(function (index, card) {
    if (
      !$(card)
        .children()
        .eq(2)
        .children()
        .eq(0)
        .text()
        .toLowerCase()
        .includes(text.toLowerCase()) &&
      !$(card)
        .children()
        .eq(2)
        .children()
        .eq(1)
        .text()
        .toLowerCase()
        .includes(text.toLowerCase())
    ) {
      if ($(card).attr("id") !== "myApplicationscard") {
        $(card).attr("hidden", true);
      }
    } else {
      if ($(card).attr("id") !== "myApplicationsCard") {
        $(card).attr("hidden", false);
      }
    }
  });
}

async function switchTabs(tab) {
  var tabToDeselect = $($(".profile")[0]);

  tabToDeselect.removeClass("profile");

  if (tabToDeselect.children().length > 2) {
    tabToDeselect.children().eq(1).css("color", "");
    tabToDeselect.children().eq(2).css("color", "#4516ac");
  } else {
    tabToDeselect.children().eq(0).css("color", "");
    tabToDeselect.children().eq(1).css("color", "#4516ac");
  }

  tab.addClass("profile");

  if (tab.children().length > 2) {
    tab.children().eq(1).css("color", "white");
    tab.children().eq(2).css("color", "white");
  } else {
    tab.children().eq(0).css("color", "white");
    tab.children().eq(1).css("color", "white");
  }
}

async function loadHomeSection() {
  try {
    //const response = await fetch("home-section.html");
    if (response.ok) {
      const content = await response.text();
      homeSection.html(content);
    } else {
      //console.error("Eroare la încărcarea conținutului.");
    }
  } catch (error) {
    //console.error("Eroare la încărcarea conținutului:", error);
  }
}

async function loadCommentsSection() {
  try {
    //const response = await fetch("comments-section.html");
    if (response.ok) {
      const content = await response.text();
      commentsSection.html(content);
    } else {
      //console.error("Eroare la încărcarea conținutului.");
    }
  } catch (error) {
    //console.error("Eroare la încărcarea conținutului:", error);
  }
}

async function loadHistorySection() {
  try {
    //const response = await fetch("history-section.html");
    if (response.ok) {
      const content = await response.text();
      historySection.html(content);
    } else {
      //console.error("Eroare la încărcarea conținutului.");
    }
  } catch (error) {
    //console.error("Eroare la încărcarea conținutului:", error);
  }
}

async function loadSettingsSection() {
  try {
    //const response = await fetch("settings-section.html");
    if (response.ok) {
      const content = await response.text();
      settingsSection.html(content);
    } else {
      //console.error("Eroare la încărcarea conținutului.");
    }
  } catch (error) {
    //console.error("Eroare la încărcarea conținutului:", error);
  }
}

async function loadMyApplications() {
  try {
    //const response = await fetch("myapps.html");
    if (response.ok) {
      const content = await response.text();
      settingsSection.html(content);
    } else {
      //console.error("Eroare la încărcarea conținutului.");
    }
  } catch (error) {
    //console.error("Eroare la încărcarea conținutului:", error);
  }
}

async function loadEndpoint() {
  try {
    //const response = await fetch("myapps.html");
    if (response.ok) {
      const content = await response.text();
      settingsSection.html(content);
    } else {
      //console.error("Eroare la încărcarea conținutului.");
    }
  } catch (error) {
    //console.error("Eroare la încărcarea conținutului:", error);
  }
}

async function closeApplicationModal() {
  $("#myModal").hide();
}

async function closeEndpointModal() {
  $("#addEndpointModal").hide();
}

async function deleteEndpointModal() {
  $("#myModal2").show();
}

async function cancelDeleteEndpointModal() {
  $("#myModal2").hide();
}

async function showHistory() {
  $("#viewHistoryPopup").show();
}

async function cancelHistory() {
  $("#viewHistoryPopup").hide();
}

async function viewReportsApp() {
  $('#viewReportsApp').show();
}

async function cancelViewHistoryAppModal() {
  $('#viewReportsApp').hide();
}

async function viewComments() {
  $('#viewComments').show();
}

async function cancelViewComments() {
  $('#viewComments').hide();
}

function menuBtnChange() {
  if (sidebar.hasClass("open")) {
    closeBtn.removeClass("bx-menu").addClass("bx-menu-alt-right");
  } else {
    closeBtn.removeClass("bx-menu-alt-right").addClass("bx-menu");
  }
}



function tryGithubAuth() {
  var code = new URLSearchParams(window.location.search).get("code");
  if (code == null) return;

  var clientId = "39c7fb795ce563b0d1bb";
  var clientSecret = "dc5bdee410fa856f303804cd40f210b5c66ebc2f";

  $.ajax({
    type: "POST",
    url: "https://github.com/login/oauth/access_token",
    dataType: "json",
    data: {
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
    },
    success: function (data) {
      console.log(data);
    },
    error: function (error) {
      var access_token = error.responseText.substring(
        error.responseText.indexOf("=") + 1,
        error.responseText.indexOf("&")
      );

      $.ajax({
        type: "GET",
        url: "https://api.github.com/user",
        headers: {
          Authorization: "Bearer " + access_token,
        },
        success: function (data) {
          var id = data.id;

          register({
            email: "g" + id,
            password: "github",
          })
            .done(function (data) {
              $.cookie("UserId", parseInt(data), { expires: 30, path: "/" });
              window.location.href =
                "http://127.0.0.1:5500/templates/main/dashboard.html";
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
              login({
                email: "g" + id,
                password: "github",
              })
                .done(function (data) {
                  $.cookie("UserId", parseInt(data), { expire: 30, path: "/" });
                  window.location.href =
                    "http://127.0.0.1:5500/templates/main/dashboard.html";
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                  console.log(errorThrown);
                });
            });
        },
        error: function (error) {
          console.log(error);
        },
      });
    },
  });
}




$(document).ready(function () {
  tryGithubAuth();

  loadNotifications();

  $('#timeRangeSelector').change(function () {
    selectedValue = $(this).val();
    updateChart(selectedValue, currentApplicationId);
  });


  authArea = $("#authArea");
  logout = $("#logout");
  myApplicationsDashboard = $("#myApplications");
  notifications = $("#notifications");
  history = $("#history");
  information = $("#information");

  logout2 = $("#log_out_back2");
  myApplicationsDashboard2 = $("#apps-navbar");
  notifications2 = $("#comments-navbar");
  history2 = $("#history-navbar");
  information2 = $("#information-navbar");

  cards = $("#cards");
  myApplicationsCards = $("#myApplicationsCards");

  applicationTitle = $("#applicationTitle");
  applicationDescription = $("#applicationDescription");
  applicationImage = $("#applicationImage");
  addApplicationBtn = $("#addApplicationBtn");


  function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    return $.ajax({
      url: `https://localhost:7011/api/Image/upload-from-url`,
      type: 'POST',
      data: formData,
      contentType: false,
      processData: false,
    });
  }



  addApplicationBtn.click(function () {
    if (applicationTitle.val().length < 3) {
      alert("Type a valid application title!");
      return;
    }

    if (applicationDescription.val().length < 3) {
      alert("Type a valid application description!");
      return;
    }

    if (applicationImage.val() === "") {
      alert("Please insert an image for your application!");
      return;
    }
    var fileInput = document.getElementById('applicationImage2');
    var file = fileInput.files[0];

    if (!file) {
      alert("Please select an image for your application!");
      return;
    }

    var formData = new FormData();
    formData.append('image', file);

    $.ajax({
      url: 'https://localhost:7011/api/Image/upload-from-url',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        var imagePath = response.url;
      }
    });


    var imagePath = applicationImage
      .val()
      .substring(applicationImage.val().lastIndexOf("\\") + 1);


    insertApplication({
      name: applicationTitle.val(),
      description: applicationDescription.val(),
      idUserAuthor: parseInt($.cookie("UserId")),
      image: imagePath,
    }).done(function (data) {
      var idApplication = data;
      getApplicationById(data).done(function (data) {
        addCard(parseInt($.cookie("UserId")), {
          idApplication: idApplication,
          name: data[0].name,
          description: data[0].description,
          dateCreated: data[0].dateCreated,
          applicationState: data[0].applicationState,
          image: data[0].image,
        });

        applicationTitle.val("");
        applicationDescription.val("");

        $("#addSendModal").hide();

        totalProjects++;
        updatePersonalStatistics();
      });
    });
  });



  endpointUrl = $("#endpointUrl");
  endpointType = $("#endpointType");
  endpointsWrapper = $("#endpointsWrapper");
  getEndpoint = $("#getEndpoint");
  postEndpoint = $("#postEndpoint");
  putEndpoint = $("#putEndpoint");
  patchEndpoint = $("#patchEndpoint");
  deleteEndpoint = $("#deleteEndpoint");

  personalStatsEmail = $("#personalStatsEmail");
  totalProjectsLabel = $("#totalProjectsLabel");
  totalEndpointsLabel = $("#totalEndpointsLabel");
  endpointsStableLabel = $("#endpointsStableLabel");
  endpointsUnstableLabel = $("#endpointsUnstableLabel");
  endpointsDownLabel = $("#endpointsDownLabel");

  (endpointStatisticsHours = $("#endpointStatisticsHours")),
    (endpointStatisticsUnit = $("#endpointStatisticsUnit"));

  (totalApplicationsLabel = $("#totalApplicationsLabel")),
    (totalEndpointsGeneralLabel = $("#totalEndpointsGeneralLabel"));
  (totalUsersLabel = $("#totalUsersLabel")),
    (totalEndpointCallsLabel = $("#totalEndpointCallsLabel"));

  reportMentions = $("#reportMentions");

  notification = $("#notification");
  notificationWrapper = $("#notificationWrapper");
  notificationBadge = $("#notificationBadge");

  loadStatistics();

  checkLoginStatus();
  loadCards(0);

  var userId = $.cookie("UserId");
  if (userId !== undefined) {
    loadCards(parseInt(userId));
  }

  sidebar = $(".sidebar");
  closeBtn = $("#btn");

  closeBtn.click(function () {
    sidebar.toggleClass("open");
    menuBtnChange();
  });

  logout.click(function () {
    onLogout();
  });

  homeSection = $(".home-section");
  commentsSection = $(".comments-section");
  historySection = $(".history-section");
  settingsSection = $(".settings-section");
  myApplications = $(".myapp-section");
  addPopup = $(".popup-container10");
  endpointSection = $(".editEndpoints");

  commentsSection.hide();
  historySection.hide();
  settingsSection.hide();
  myApplications.hide();
  endpointSection.hide();

  loadHomeSection();

  $("#dash").click(function () {
    switchTabs($("#dash"));

    homeSection.hide();
    commentsSection.hide();
    historySection.hide();
    settingsSection.hide();
    myApplications.hide();
    endpointSection.hide();

    loadHomeSection();
    homeSection.show();
  });

  $("#notifications").click(function () {
    switchTabs($("#notifications"));

    homeSection.hide();
    commentsSection.hide();
    historySection.hide();
    settingsSection.hide();
    myApplications.hide();
    endpointSection.hide();

    loadCommentsSection();
    commentsSection.show();
  });

  $("#history").click(function () {
    switchTabs($("#history"));

    homeSection.hide();
    commentsSection.hide();
    historySection.hide();
    settingsSection.hide();
    myApplications.hide();
    endpointSection.hide();

    loadHistorySection();
    historySection.show();
  });

  $("#settings").click(function () {
    switchTabs($("#settings"));

    homeSection.hide();
    commentsSection.hide();
    historySection.hide();
    settingsSection.hide();
    myApplications.hide();
    endpointSection.hide();

    loadSettingsSection();
    settingsSection.show();
  });

  $("#myApplications").click(function () {
    switchTabs($("#myApplications"));

    homeSection.hide();
    commentsSection.hide();
    historySection.hide();
    settingsSection.hide();
    endpointSection.hide();

    loadMyApplications();
    myApplications.show();
  });

  commentsSection.hide();
  historySection.hide();
  settingsSection.hide();
  myApplications.hide();

  $("#dash-navbar").click(function () {
    homeSection.hide();
    commentsSection.hide();
    historySection.hide();
    settingsSection.hide();
    myApplications.hide();
    endpointSection.hide();

    loadHomeSection();
    homeSection.show();
  });

  $("#comments-navbar").click(function () {
    homeSection.hide();
    commentsSection.hide();
    historySection.hide();
    settingsSection.hide();
    myApplications.hide();
    endpointSection.hide();

    loadCommentsSection();
    commentsSection.show();
  });

  $("#history-navbar").click(function () {
    homeSection.hide();
    commentsSection.hide();
    historySection.hide();
    settingsSection.hide();
    myApplications.hide();
    endpointSection.hide();

    loadHistorySection();
    historySection.show();
  });

  $("#settings-navbar").click(function () {
    homeSection.hide();
    commentsSection.hide();
    historySection.hide();
    settingsSection.hide();
    myApplications.hide();
    endpointSection.hide();

    loadSettingsSection();
    settingsSection.show();
  });

  $("#apps-navbar").click(function () {
    homeSection.hide();
    commentsSection.hide();
    historySection.hide();
    settingsSection.hide();
    endpointSection.hide();

    loadMyApplications();
    myApplications.show();
  });

  $("#information-navbar").click(function () {
    $("#viewProfile").show();
  });

  $("#addSend").click(function () {
    $("#addSendModal").show();
  });

  $("#closeButton2").click(function () {
    $("#addSendModal").hide();
  });

  $("#addEndpoint").click(function () {
    $("#addEndpointModal").show();
  });

  $("#viewStatistics").click(function () {
    $("#viewStatisticsChoice").show();
  });

  $("#information").click(function () {
    $("#viewProfile").show();
  });

  $("#closeButtonProfile").click(function () {
    $("#viewProfile").hide();
  });

  generalEndpoints = {
    labels: ["Stable", "Unstable", "Down"],
    datasets: [
      {
        label: "Endpoints",
        data: [0, 0, 0],
        backgroundColor: ["#28a745", "#ffc107", "#dc3545"], // Verde, Galben, Roșu
        borderColor: ["#28a745", "#ffc107", "#dc3545"],
        borderWidth: 1,
      },
    ],
  };

  configGeneralEndpoints = {
    type: "pie",
    data: generalEndpoints,

    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "white",
          },
        },
        title: {
          display: true,
          text: "Total Endpoints",
          color: "#ffffff",
          font: {
            size: 20,
          },
        },
      },
    },
  };

  generalReports = {
    labels: ["Solved", "Unsolved"],
    datasets: [
      {
        label: "Reports",
        data: [30, 50],
        backgroundColor: ["#28a745", "#dc3545"], // Verde, Roșu
        borderColor: ["#28a745", "#dc3545"],
        borderWidth: 1,
      },
    ],
  };

  configGeneralReports = {
    type: "doughnut",
    data: generalReports,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "white",
          },
        },
        title: {
          display: true,
          text: "Total Reports",
          color: "#ffffff",
          font: {
            size: 20,
          },
        },
      },
    },
  };

  function downloadChart() {
    var canvas = document.getElementById("myChart");
    var context = canvas.getContext("2d");

    var img = canvas.toDataURL("image/jpeg");

    var csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Label,Value\n";
    for (var i = 0; i < endpointChartX.length; i++) {
      csvContent += endpointChartX[i] + "," + endpointChartY[i] + "\n";
    }

    var csvBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    var csvURL = URL.createObjectURL(csvBlob);
    var csvLink = document.createElement("a");
    csvLink.href = csvURL;
    csvLink.download = "chart_data.csv";

    var rar = new JSZip();
    rar.file("chart.jpg", img.substr(img.indexOf(",") + 1), { base64: true });
    rar.file("chart_data.csv", csvBlob);

    rar.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "chart_files.rar");

      showNotification();
    });
  }

  var downloadButton = document.getElementById("downloadButton");
  downloadButton.addEventListener("click", downloadChart);

  setInterval(function () {
    loadStatistics();
  }, 15000);

  setInterval(function () {
    loadNotifications();
  }, 1000);






});

window.searchCards = searchCards;
window.searchEndpoints = searchEndpoints;
window.addEndpoint = addEndpoint;
window.closeEndpointModal = closeEndpointModal;
window.closeApplicationModal = closeApplicationModal;
window.deleteCard = deleteCard;
window.deleteEndpointModal = deleteEndpointModal;
window.cancelDeleteEndpointModal = cancelDeleteEndpointModal;
window.onDeleteEndpoint = onDeleteEndpoint;
window.showEndpointStatistics = showEndpointStatistics;
window.cancelEndpointStatisticsModal = cancelEndpointStatisticsModal;
window.searchMyApplicationsCards = searchMyApplicationsCards;
window.showReportModal = showReportModal;
window.cancelReportModal = cancelReportModal;
window.addReport = addReport;
window.onFilterEndpoints = onFilterEndpoints;
window.showHistory = showHistory;
window.cancelHistory = cancelHistory;
window.viewReportsApp = viewReportsApp;
window.viewComments = viewComments;
window.cancelViewHistoryAppModal = cancelViewHistoryAppModal;
window.cancelViewComments = cancelViewComments;
