# Registering with IONIC

Register to a website from an application in your smartphone using JWT _Json Web Token_

Another try with IONIC :wink:

> To generate APK file I'm launching a script in my windows system

Here is a copy of my `set_path_android_java.bat` file
```
set ANDROID_HOME=E:\Android\Sdk\
set JAVA_HOME=C:\app\openjdk-1.8.0_x86_64
set PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools;%JAVA_HOME%\bin
```

So I'm using _OpenJDK_

For the testing IRL, I've build a website: http://test.sotfall.com made with Laravel

### routes\api.php
```php
Route::middleware('api')->get('/all_users', 'UsersController@getAllUsers');

Route::middleware('api')->get('/user_request', 'UsersController@index');
Route::middleware('api')->post('/user_request', 'UsersController@store');
Route::middleware('api')->delete('/user_request', 'UsersController@delete');

// MESSAGES
Route::middleware('api')->post('/send_message', 'MessageController@store');
```
