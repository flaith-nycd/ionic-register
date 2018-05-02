# Registering with IONIC

Register to a website from an application in your smartphone using JWT _Json Web Token_

Another try with IONIC :wink:

> To generate APK file I'm launching a script in my windows system

Here is a copy of my `set_path_android_java.bat` file:

```
set ANDROID_HOME=E:\Android\Sdk\
set JAVA_HOME=C:\app\openjdk-1.8.0_x86_64
set PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools;%JAVA_HOME%\bin
```

So I'm using _OpenJDK_

For the testing IRL, I've build a website: http://test.sotfall.com made with Laravel

## Laravel parts

You'll need to add CORS (Cross-Origin Resource Sharing) headers support in your Laravel application

To do so, you should install [lavarel-cors from barryvdh](https://github.com/barryvdh/laravel-cors)

* PHP

<details><summary markdown="span"><code>routes\api.php</code></summary>

```php
Route::middleware('api')->get('/all_users', 'UsersController@getAllUsers');

Route::middleware('api')->get('/user_request', 'UsersController@index');
Route::middleware('api')->post('/user_request', 'UsersController@store');
Route::middleware('api')->delete('/user_request', 'UsersController@delete');

// MESSAGES
Route::middleware('api')->post('/send_message', 'MessageController@store');
```

</details>

<details><summary markdown="span"><code>routes\web.php</code></summary>

```php
Route::get('/home', 'HomeController@index')->name('home');
Route::get('/show_users', 'UsersController@showAllUsers')->name('show_users');
Route::get('/show_messages', 'MessageController@show')->name('show_messages');
```

</details>

<details><summary markdown="span"><code>app\Http\Controllers\UserController.php</code></summary>

```php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Response;

class UsersController extends Controller
{
    public function index(Request $request) {
        // Error messages
        $returnErrorID = [ 'OOPS' => 'ID NOT FOUND !!!' ];

        // How many request do we have?
        $requestCount = count($request->request);

        // If there is, at least, 1 request
        if ($requestCount > 0) {
            // Only get request with 'id='
            $id = $request->id;

            // Did we found it?
            if (isset($id)) {
                $user = User::where('id', $id)->first();
                if ($user !== null) {
                    $status = 200;
                    $userData = [
                        'name' => $user->name,
                        'email' => $user->email,
                        'unique_token' => $user->unique_token
                    ];
                    return response()->json($userData, $status);
                } else {
                    return response()->json($returnErrorID, 400);
                }
            }
        }
/*
        if ($requestCount > 0) {
            dump($request);
            echo "Request:"; 
            dump($request->request);

            foreach ($request->request as $key => $value) {
                echo "KEY: " . $key . " - VALUE: " . $value . "<br/>";
            }
        } else {
            echo "NO REQUEST";
            dd();
        }
*/
    }

    /**
     * FOR THE API ONLY
     */
    public function getAllUsers(){
        $users = User::all();
        return Response::json(array('users' => $users));
    }

    /**
     * FOR THE WEB ONLY
     */
    public function showAllUsers(){
        $users = User::all();
        return view('users.show', compact('users'));
    }

    public function store(Request $request) {
        // Get requests from Smartphone
        $name = $request->name;
        $email = $request->email;
        $password = $request->password;

        // Check if user email already exist in the database
        if (User::where('email', $email)->first()) {
            // If found, send a message with a status
            // https://stackoverflow.com/a/40504085/6765082

            // https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
            // http://www.restapitutorial.com/httpstatuscodes.html

            // Return 409 if the caller tries to create a resource that already exists
            $status = 409;
            $returnData = [
                'message' => 'Email already exists !!!'
            ];
            return response()->json($returnData, $status);
        } else {
            $newUserFromRequest = [
                'name' => $name,
                'email' => $email,
                'password' => bcrypt($password),
                'unique_token' => md5(uniqid($email, true))
            ];
            User::create($newUserFromRequest);
        }

/*
        if ($username != "test") {
            $status = 400;
            $returnData = array(
                // 'status' => 'error',
                'message' => 'Not the good user!'
            );
            // return Response::json($returnData, 500);
            // return response()->json($returnData, 400);
            return response()->json($returnData, $status);
        }
*/
        return $newUserFromRequest;
        // response()->json($newUserFromRequest, 200);
    }

    public function delete(Request $request) {
        // Get requests from Smartphone
        $unique_token = $request->unique_token;

        $userByToken = User::where('unique_token', $unique_token)->first();

        // Check if our token already exist in the database
        if ($userByToken) {
            // If found, we can delete this user
            $userByToken->delete();

            $returnData = [
                'message' => 'DELETED'
            ];
        } else {
            $status = 404;
            $returnData = [
                'message' => 'You are not found in our database !!!'
            ];
            return response()->json($returnData, $status);
        }

        return $returnData;
    }
}
```

</details>

<details><summary markdown="span"><code>app\Http\Controllers\MessageController.php</code></summary>

```php
namespace App\Http\Controllers;

use App\Message;
use App\User;
use App\Events\MessageReceived;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $newMessageFromRequest = [
            'from_token' => $request->from_token,
            'subject' => $request->subject,
            'body' => $request->body
        ];

        // Using get() you get a collection,
        // $user = User::where('unique_token', $request->from_token)->get();
        // In this case you need to iterate over it to get properties:
        // @foreach ($collection as $object)
        //     {{ $object->title }}
        // @endforeach
        // Then use:
        // if ($user->isempty()) {

        // When you're using find() or first() you get an object, so you can get properties with simple:
        // {{ $object->title }}
        $user = User::where('unique_token', $request->from_token)->first();
        // $user = User::where('unique_token', $request->from_token)->find();

        if ($user == null) {
            $returnData = [
                'message' => 'Token not found in our database !!!'
            ];
            return response()->json($returnData, 404);
        }

        Message::create($newMessageFromRequest);
        $returnData = [
            'message' => 'Your message has been stored'
        ];
        // logger($user);
        event(new MessageReceived($user));
        return response()->json($returnData, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\message  $message
     * @return \Illuminate\Http\Response
     */
    public function show(Message $message)
    {
        // $message_list = $message::all();
        // Use eager loading instead
        // Show only unread messages
        // GET a collection (with get() only) to iterate
        $message_list = $message::where('read', false)->get();

        return view('messages.show', compact('message_list'));
    }
}
```

</details>

- - - -

* BLADE

<details><summary markdown="span"><code>ressources\views\welcome.blade.php</code></summary>

```html
    <body>
        <div class="flex-center position-ref full-height">
            @if (Route::has('login'))
                <div class="top-right links">
                    @auth
                        <a href="{{ url('/home') }}">Home</a>
                    @else
                        <a href="{{ route('login') }}">Login</a>
                        <a href="{{ route('register') }}">Register</a>
                    @endauth
                </div>
            @endif

            <div class="content">
                <div class="title m-b-md">
                    Test API-SERVER
                </div>

                <div class="links">
                    <a href="{{route('show_users')}}">Show all users</a>
                    <a href="{{route('show_messages')}}">Show messages from users</a>
                </div>
            </div>
        </div>
    </body>
```

</details>

<details><summary markdown="span"><code>ressources\views\users\show.blade.php</code></summary>

```html
  <body>
    <a class="btn-primary" href="/">Home</a>
    <h1>Show users</h1>

    @if(count($users))
    Name&nbsp;|&nbsp;email&nbsp;|&nbsp;token<br>
    ------&nbsp;|&nbsp;---------&nbsp;|&nbsp;--------<br>
        @foreach($users as $user)
            {{ $user->name }}
            &nbsp;|&nbsp; 
            {{ $user->email }}
            &nbsp;|&nbsp; 
            {{ $user->unique_token }}
            <br>
        @endforeach
    @else
        NO USERS
    @endif
  </body>
```

</details>

<details><summary markdown="span"><code>ressources\views\messages\show.blade.php</code></summary>

```html
  <body>
    <a class="btn-primary" href="/">Home</a>
    <h1>Show message</h1>

    @if(count($message_list))
    Sujets&nbsp;|&nbsp;Messages<br>
    ------&nbsp;|&nbsp;--------<br>
        @foreach($message_list as $message)
        <!-- 
        Don't need to check because we already do it
        in the MessageController
        -->
        <!-- @if(!$message->read) -->
            {{ $message->subject }}
            &nbsp;|&nbsp; 
            {{ $message->body }}
            <br>
        <!-- @endif -->
        @endforeach
    @else
        NO MESSAGES
    @endif
  </body>
```

</details>

- - - -

* EVENTS

<details><summary markdown="span"><code>app\Events\MessageReceived.php</code></summary>

```php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class MessageReceived
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Declare a user variable to be used by MessageListener
     *
     * public function handle(MessageReceived $event)
     * {
     *     $message = $event->user->name . ' just send a message.';
     *     Log::info($message);
     * }
     */
    public $user;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($user)
    {
        $this->user = $user;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('channel-name');
    }
}
```

</details>

<details><summary markdown="span"><code>app\Listeners\MessageListener.php</code></summary>

```php
namespace App\Listeners;

use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

// ADDED MessageReceived event: MANDATORY
use App\Events\MessageReceived;
// ADDED Log Facade to check in storage/laravel.log
use Illuminate\Support\Facades\Log;

class MessageListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  MessageReceived  $event
     * @return void
     */
    public function handle(MessageReceived $event)
    {
        $message = $event->user->name . ' just send a message.';
        Log::info($message);
        // Inside event cannot redirect
        //redirect()->route('show_message');
    }
}
```

</details>
