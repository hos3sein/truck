# Truck service

This system for driver and order truck

## install

```
npm install
```

## run project

```
npm run dev
```

```
SERVER : http://121.41.58.117:8008/api/v1/truck
LOCAL : http://localhost:8008/api/v1/truck
PORT : 8008
```

# Driver

#

#

#

#### Refresh : refreshTruck

#### Call Route : order For Me

#

#

#

## Order For Me

##### URL : driver/recommended

##### Method : GET

#

#

#

## Reject Order

##### URL : driver/rejectorder/:logId

##### Method : GET

#

#

#

## Accept Order

##### URL : driver/acceptorder/:logId

##### Method : GET

#

##### Refresh : refreshOrderRequester

##### Call Route : ALL ORDER ME FOR ORDER REQUESTER

##### Notif : TYPE: accept order

#

#

#

#

## Profile Me

##### URL : driver/profileme

#

##### Method : GET

#

#

## All Order

##### URL : driver/historyorderme

##### Method : GET

#

#

## Update profile

##### URL : driver/updateprofile

##### Method : POST

#

#

| Parameter             | Type      | Description   |
| :-------------------- | :-------- | :------------ |
| `orderRadius`         | `Number`  | **Required**, |
| `active`              | `Boolean` | **Required**, |
| `companyName`         | `String`  | **Required**, |
| `companyLicensePhoto` | `String`  | **Required**, |
| `idCard`              | `Number`  | **Required**, |
| `idCardPhoto`         | `String`  | **Required**, |
| `truckType`           | `Number`  | **Required**, |
| `truckPlate`          | `String`  | **Required**, |
| `truckPlatePhoto`     | `String`  | **Required**, |
| `transportCapacity`   | `Number`  | **Required**, |
| `profileCompany`      | `String`  | **Required**, |
| `depositAmount`       | `Number`  | **Required**, |
| `transportIncome`     | `Number`  | **Required**, |

#

#

## Change Status

##### URL : driver/changestatus/:orderId/:status

##### Method : GET

##### Refresh : refreshOrderRequester

##### Call Route : ALL ORDER ME FOR ORDER REQUESTER

##### Notif : TYPE: change status

#

#

#### 0 == Init

#### 1 == Booked

#### 2 == Picked Up

#### 3 == Deliverd

#

#

#

#

# ORDER

##

##

## Create Order

##### URL : order/createordertruck

#

##### Method : POST

#

| Parameter              | Type     | Description                    |
| :--------------------- | :------- | :----------------------------- |
| `truckType`            | `Number` | **Required**,                  |
| `productName`          | `String` | **Required**.                  |
| `origin`               | `Obj`    | **Required**.                  |
| `addressOrigin`        | `String` | **Required**.                  |
| `phoneNumberSender`    | `String` | **Required**.                  |
| `lineMakerOrigin`      | `Bol`    | **Required**.                  |
| `destination`          | `Obj`    | **Required**.                  |
| `addressDestination`   | `String` | **Required**.                  |
| `phoneNumberReceiver`  | `String` | **Required**.                  |
| `lineMakerDestination` | `Bol`    | **opanail**.                   |
| `price`                | `Number` | **Required**.                  |
| `date`                 | `Obj`    | **Required**. day, month, year |
| `note`                 | `String` | **opanail**.                   |
| `distance`             | `Number` | **Required**.                  |
| `favoriteOrogin`       | `Bol`    | **opanail**.                   |
| `favoriteDestination`  | `Bol`    | **opanail**.                   |

### All Order Me

##### URL : order/historyorderme

##### Method : GET

##

#

### Expire to Pending

##### URL : order/topending/:orderId

##### Method : GET

##

#

#

### Update Price

##### URL : order/updateprice/:orderId/:price

##### Method : GET

#

#

#

### Delete Order Me

##### URL : order/delorderme/:orderId

##### Method : GET

##

### Cancel Driver

##### URL : order/canceldriver/:orderId

##### Method : GET

#

#### Refresh : refreshTruck

##### Refresh : refreshOrderRequester

#

##
