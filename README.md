Creați o aplicație care monitorizează alte aplicații. Sa ii spunem ItecMonitor.

ItecMonitor va avea un Developer Dashboard si un Dashboard public. Dashboardul pentru Developer se poate accesa doar după autentificare. 
Autentificarea poate fi atât user/pass cat si prin social media accounts.

Punctarea se va face bazat pe Tiers. Pentru fiecare tier îndeplinit se primesc de la 0 la 10 de puncte in funcție de complexitatea implementării. 

Tier 1.
* Developerul poate să adauge Aplicații pentru monitorizare, si poate înregistra endpointuri pentru aceasta aplicație. 
* Pentru fiecare aplicație, Developerul are acces la un Dashboard, in care vede toate endpointurile listate cu starea lor pe ultimele X zile/ore.

Tier 2. 
* Pentru a monitoriza starea aplicației, ItecMonitor va call-uii endpointurile înregistrate în intervale de X secunde si va asigna 3 stări acelui endpoint:
    - Stable (ultimele 10 call-uri sunt 200 sau 302)
    - Unstable (exista cel puțin un call, din ultimele 10 care nu este 200 sau 302)
    - Down (nici unul din ultimele 10 call-uri nu e 200 sau 302)
* In funcție de răspunsuri se va afișa in Dashboard evoluția stării fiecărui endpoint.
* Starea aplicației este definita de cumulul stărilor endpointurile. Adică, 
      Daca toate endpointurile sunt pe Stable, aplicația e Stable. 
      Daca cel puțin un endpoint este pe Unstable sau Down, atunci aplicația este Unstable. 
      Daca toate endpointurile sunt pe Down, aplicația este Down.

Tier 3.
* Din Dashboardul public, se poate raporta un bug de către orice utilizator/vizitator al acelui Dashboard.
* Odată raportat, bug-ul trebuie sa apară într-o secțiune dedicată în Dashboardul Developerului si Aplicația trece pe Unstable daca este pe Stable. Daca Aplicația este pe Unstable sau Down, raportarea unui bug nu va schimba starea aplicației. Daca aplicația are raportat un bug, cat timp acesta nu este marcat ca rezolvat de către Developer, aplicația NU poate trece înapoi in Stable.

Tier 4. 
* Când este raportat un bug, Developerul este notificat. Alegerea modalității de notificare este la alegerea echipei, si in funcție de complexitate se va primi punctaj diferit. 

Tier 5.
* Starea endpointurilor se va reîmprospăta in real-time pe Dashboardului.
* Developerul are posibilitatea, într-o rubrica de Setări, sa editeze intervalele notate cu X in enunț.



https://github.com/AlexandruTud/iTecHackathon.WebApplication/assets/95827917/f0a056b0-e69e-4479-b407-7422affc4348


  
![WhatsApp Imag44e 2024-04-07 at 15 12 53](https://github.com/AlexandruTud/iTecHackathon.WebApplication/assets/95827917/514d1a5e-0ed2-41b5-bc21-155fd6f2d2ec)

![WhatsApp23 Image 2024-04-07 at 15 12 50](https://github.com/AlexandruTud/iTecHackathon.WebApplication/assets/95827917/cae7c704-0b31-47b4-8124-1de57224b196)

![WhatsApp Image33 2024-04-07 at 15 12 51](https://github.com/AlexandruTud/iTecHackathon.WebApplication/assets/95827917/08010bab-4ce2-4ff3-8330-bdc6fd955938)

![WhatsApp Image 322024-04-07 at 15 12 52](https://github.com/AlexandruTud/iTecHackathon.WebApplication/assets/95827917/36bd30df-b280-4cfc-8c07-9a35d26d9fbf)

![WhatsApp Image 2024-04-07 at 15 12 50](https://github.com/AlexandruTud/iTecHackathon.WebApplication/assets/95827917/be9fdf18-6bd3-4957-b2dd-f1a533d2df9d)

![WhatsApp Image 2024-04-07 at 15 12 49](https://github.com/AlexandruTud/iTecHackathon.WebApplication/assets/95827917/4e88854f-e3a6-4d42-bd12-2bc47b3fd70a)

![WhatsApp Imag333e 2024-04-07 at 15 12 50](https://github.com/AlexandruTud/iTecHackathon.WebApplication/assets/95827917/a0688ee8-d762-4cdc-a563-5938dc223e94)

![WhatsApp Im32age 2024-04-07 at 15 12 53](https://github.com/AlexandruTud/iTecHackathon.WebApplication/assets/95827917/b797f7c6-2d07-4016-a56a-f539e1504121)

![WhatsApp I2mage 2024-04-07 at 15 12 50](https://github.com/AlexandruTud/iTecHackathon.WebApplication/assets/95827917/bee76b83-4c66-46b9-8342-7beee7eacc5f)

![22 Image 2024-04-07 at 15 12 51](https://github.com/AlexandruTud/iTecHackathon.WebApplication/assets/95827917/9190e94f-e7c4-4834-8fb7-e38de943aa2a)



