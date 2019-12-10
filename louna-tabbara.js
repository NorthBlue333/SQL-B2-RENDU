const name = "louna-tabbara"
const promo = "B2B"

const q1 = `
SELECT * FROM Track
WHERE track.Milliseconds < (SELECT Milliseconds FROM Track WHERE TrackId = 3457)
`

const q2 = `SELECT * FROM Track t
JOIN MediaType m ON
t.MediaTypeId = m.MediaTypeId
WHERE t.MediaTypeId = (SELECT t.MediaTypeId FROM Track t
WHERE lower(t.Name) = 'Rehab')`
const q3 = `SELECT p.PlaylistId, p.Name, count(pt.PlaylistId) 'Nombre de chanson', sum(t.Milliseconds) 'Durée totale en ms', avg(t.Milliseconds) 'Moyenne chanson en ms' FROM Playlist p 
JOIN PlaylistTrack pt ON
pt.PlaylistId = p.PlaylistId
JOIN Track t ON t.TrackId = pt.TrackId
GROUP BY p.PlaylistId, P.Name`
const q4 = ` SELECT p.PlaylistId, p.Name
FROM Playlist p
    JOIN PlaylistTrack pt ON p.PlaylistId = pt.PlaylistId
    JOIN Track t ON pt.TrackId = t.TrackId
GROUP BY p.PlaylistId, p.Name
HAVING SUM(t.Milliseconds) > (SELECT AVG(average)
FROM (SELECT AVG(t.Milliseconds) AS "average"
    FROM Playlist p
        JOIN PlaylistTrack pt ON p.PlaylistId = pt.PlaylistId
        JOIN Track t ON pt.TrackId = t.TrackId
    GROUP BY p.PlaylistId) myTable )
`
const q5 = `SELECT p.PlaylistId, p.Name FROM Playlist p
JOIN PlaylistTrack pt ON p.PlaylistId = pt.PlaylistId
GROUP BY p.PlaylistId, p.Name
HAVING COUNT(pt.TrackId) IN (
  SELECT COUNT(pt.TrackId) from PlaylistTrack pt
  JOIN Playlist p ON p.PlaylistId = pt.PlaylistId
  WHERE p.PlaylistId IN (1,13)
  GROUP BY p.PlaylistId
)
`
const q6 = `SELECT c.FirstName FROM Customer c
WHERE ( SELECT MAX(sums) FROM
    (
      SELECT
        SUM(il.UnitPrice * il.Quantity) AS sums
      FROM
        Invoice AS i
        JOIN InvoiceLine AS il ON i.InvoiceId = il.InvoiceId
      WHERE
        LOWER(i.BillingCountry) <> 'france'
        AND i.CustomerId = c.CustomerId
      GROUP BY
        i.InvoiceId
    ) b
) > (
  SELECT MAX(sums) FROM
    (
      SELECT
        SUM(il.UnitPrice * il.Quantity) AS sums
      FROM
        Invoice AS i
        JOIN InvoiceLine AS il ON i.InvoiceId = il.InvoiceId
      WHERE
        LOWER(i.BillingCountry) = 'france'
      GROUP BY
        i.InvoiceId
    ) a)
;`
const q7 = `SELECT 
    max(Total),
    min(Total), 
    (sum(Total)/count(Total)), 
    count(Total), 
    (count(Total) * 100.0 /  (SELECT count(*) FROM Invoice)), 
    BillingCountry 
FROM Invoice
GROUP BY BillingCountry;`
const q8 = `SELECT * , (SELECT sum(UnitPrice)
FROM Track) / (SELECT count(*)
FROM Track) AS "Prix Moyen", med.Name AS "Media name", (SELECT sum(UnitPrice)
FROM Track JOIN MediaType ON MediaType.MediaTypeId = Track.MediaTypeId
where MediaType.Name = med.Name) / (SELECT count(*)
FROM Track JOIN MediaType ON MediaType.MediaTypeId = Track.MediaTypeId
where MediaType.Name = med.Name)
FROM Track
JOIN MediaType med ON med.MediaTypeId = Track.MediaTypeId
where UnitPrice > ((SELECT sum(UnitPrice)
FROM Track) / (SELECT count(*)
FROM Track));`
const q9 = `SELECT count(distinct(Artist.ArtistId)), 
FROM Playlist pl
JOIN PlaylistTrack plt ON
    pl.PlaylistId = plt.PlaylistId
JOIN Track ON 
    plt.TrackId = Track.TrackId
JOIN Album ON Track.AlbumId = Album.AlbumId
JOIN Artist ON Album.ArtistId = Artist.ArtistId
GROUP BY pl.PlaylistId;`
const q10 = `SELECT 
    count(distinct(Artist.ArtistId)) AS "nombre d'artistes différents présents sur la playlist", 
    (count(Artist.ArtistId)*1.0/count(distinct(Artist.ArtistId))) AS "nombre de chansons par artiste",
    sum(Track.UnitPrice) AS "prix moyen des chansons par artiste"
FROM Playlist pl
JOIN PlaylistTrack plt ON
    pl.PlaylistId = plt.PlaylistId
JOIN Track ON 
    plt.TrackId = Track.TrackId
JOIN Album ON Track.AlbumId = Album.AlbumId
JOIN Artist ON Album.ArtistId = Artist.ArtistId
GROUP BY pl.PlaylistId;`
const q11 = `SELECT a.country,  sum(a.Nombre) AS 'Nombre de fois' FROM (
    SELECT c.Country, count(c.country) AS Nombre FROM Customer c
    GROUP BY c.Country
    UNION ALL
    SELECT distinct e.Country, count(e.country) AS Nombre FROM Employee e
    GROUP BY e.Country
    UNION ALL
    SELECT distinct i.BillingCountry, count(i.BillingCountry) AS Nombre FROM Invoice i
    GROUP BY i.BillingCountry
    ) AS a
    GROUP BY a.Country;`
const q12 = `SELECT a.country,  sum(a.Nombre) AS 'Nombre de fois', sum(a.Customers) Customers, sum(a.Employees) Employees, sum(a.Invoices) Invoices FROM (
    SELECT c.Country, count(c.country) AS Nombre, count(c.CustomerId) AS Customers, 0 AS Employees, 0 AS Invoices FROM Customer c
    GROUP BY c.Country
    UNION ALL
    SELECT distinct e.Country, count(e.country) AS Nombre, 0 AS Customers, count(e.EmployeeId) AS Employees, 0 AS Invoices FROM Employee e
    GROUP BY e.Country
    UNION ALL
    SELECT distinct i.BillingCountry, count(i.BillingCountry) AS Nombre, 0 AS Customers, 0 AS Employees, count(i.InvoiceId) AS Invoices FROM Invoice i
    GROUP BY i.BillingCountry
    ) AS a
    GROUP BY a.Country;`
const q13 = `SELECT t.TrackId, t.GenreId, i.InvoiceId
FROM Invoice i
    JOIN InvoiceLine il
    ON  i.InvoiceId = il.InvoiceId
    JOIN Track t
    ON il.TrackId = t.TrackId
WHERE t.Milliseconds = (SELECT max(milliseconds)
FROM Track
WHERE GenreId = t.GenreId)`
const q14 = `SELECT AVG(il.UnitPrice) AS "Prix moyen par chansons", sum(t.milliseconds)/1000 AS "Secondes", sum(il.UnitPrice) / (sum(t.milliseconds)/1000) AS "Cout des chansons par secondes" 
FROM InvoiceLine il
JOIN Track t ON
il.TrackId = t.TrackId
GROUP BY il.InvoiceId;`
const q15 = ``
const q16 = `SELECT top 1 T.Nom FROM (SELECT top 3 concat(e.LastName, ' ', e.FirstName) Nom, sum(i.Total) Maximum
FROM Employee e
JOIN Customer c ON
e.EmployeeId = c.SupportRepId
JOIN Invoice i
ON c.CustomerId = i.CustomerId
GROUP BY e.LastName, e.FirstName
order by Maximum Asc) as T;`
const q17 = `SELECT p.Name, p.PlaylistId, count(il.trackId) FROM  Playlist p
JOIN PlaylistTrack pt ON 
pt.PlaylistId = p.PlaylistId
JOIN Track t ON
pt.trackId = t.TrackId
JOIN InvoiceLine il ON
il.trackId = t.trackId
GROUP BY p.PlaylistId, p.Name, il.trackId`
const q18 = `-- Create a new database called 'dbcreate'
-- Connect to the 'master' database to run this snippet
USE master
GO
-- Create the new database if it does not exist already
IF NOT EXISTS (
    SELECT name
FROM sys.databases
WHERE name = N'dbcreate'
)
CREATE DATABASE dbcreate
GO


USE dbcreate


CREATE TABLE Permission
(
    id INT NOT NULL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
);
GO

CREATE TABLE "Role"
(
    id INT NOT NULL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
);
GO

CREATE TABLE "Role_Permission"
(
    role_id INT NOT NULL PRIMARY KEY,
    permission_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES "Role" (id),
    FOREIGN KEY (permissiON_id) REFERENCES Permission (id)
);
GO

CREATE TABLE "Group"
(
    id INT NOT NULL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
);
GO

CREATE TABLE "Group_Role"
(
    group_id INT NOT NULL PRIMARY KEY,
    role_id INT NOT NULL,
    FOREIGN KEY (group_id) REFERENCES "Group" (id),
    FOREIGN KEY (role_id) REFERENCES "Role" (id)
);
GO

CREATE TABLE "User"
(
    id INT NOT NULL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    superuser BIT DEFAULT 0,
);
GO

CREATE TABLE "User_Group"
(
    user_id INT NOT NULL PRIMARY KEY,
    group_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "User" (id),
    FOREIGN KEY (group_id) REFERENCES "Group" (id)
);
GO

CREATE TABLE "User_Role"
(
    user_id INT NOT NULL PRIMARY KEY,
    role_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "User" (id),
    FOREIGN KEY (role_id) REFERENCES "Role" (id)
);
GO`
const q19 = `
INSERT INTO Track
    ("Name",MediaTypeId,Milliseconds, UnitPrice)
VALUES('Au clair de la lune', 1, 30009, 1),
    ('Frère jacques', 3, 78909, 2),
    ('Baby', 2, 33819, 2);`
const q20 = `INSERT INTO Employee
    (LastName,FirstName, Country, PostalCode)
VALUES('Castera', 'Julien', 'France', '33000'),
    ('Tabbara', 'Louna', 'France', '33000');`
const q21 = `DELETE il
FROM InvoiceLine il
    INNER JOIN Invoice i
    ON il.InvoiceId = i.InvoiceId
WHERE YEAR(i.InvoiceDate) = '2010';
GO
DELETE FROM Invoice
WHERE YEAR(InvoiceDate) = '2010';`
const q22 = `UPDATE Invoice
SET CustomerId =
(SELECT TOP 1
    c.CustomerId
FROM Invoice i
    INNER JOIN Customer c ON i.CustomerId = c.CustomerId
WHERE c.Country = 'France'
GROUP BY c.CustomerId
ORDER BY COUNT(c.CustomerId) DESC
)
WHERE YEAR(InvoiceDate) BETWEEN '2011' AND '2014';`

const q23 = `UPDATE Invoice
SET BillingCountry =
(SELECT Country
FROM Customer
WHERE Customer.CustomerId = Invoice.CustomerId)
FROM Invoice
    JOIN Customer
    ON Invoice.CustomerId = Customer.CustomerId
WHERE BillingCountry != Customer.Country;`
const q24 = `ALTER TABLE Employee
ADD salary INT NULL;`
const q25 = `DECLARE @MyCursor CURSOR;
DECLARE @MyField int;
BEGIN
    SET @MyCursor = CURSOR FOR
    SELECT EmployeeId
    FROM Employee

    OPEN @MyCursor
    FETCH NEXT FROM @MyCursor 
    INTO @MyField

    WHILE @@FETCH_STATUS = 0
    BEGIN
        UPDATE Employee
        SET salary = FLOOR(RAND()*(100000-30000+1))+30000
        WHERE EmployeeId = @MyField;
        FETCH NEXT FROM @MyCursor 
      INTO @MyField
    END;

    CLOSE @MyCursor ;
    DEALLOCATE @MyCursor;
END;`
const q26 = `ALTER TABLE Invoice
DROP COLUMN BillingPostalCode`











































// NE PAS TOUCHER CETTE SECTION
const tp = { name: name, promo: promo, queries: [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, q19, q20, q21, q22, q23, q24, q25, q26] }
module.exports = tp
