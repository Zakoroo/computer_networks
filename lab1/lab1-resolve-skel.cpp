/********************************************************* -- SOURCE -{{{1- */
/** Translate host name into IPv4
 *
 * Resolve IPv4 address for a given host name. The host name is specified as
 * the first command line argument to the program. 
 *
 * Build program:
 *  $ g++ -Wall -g -o resolve <file>.cpp
 */
/******************************************************************* -}}}1- */

#include <stdio.h>
#include <stddef.h>

#include <assert.h>
#include <limits.h>
#include <unistd.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>
#include <stdint.h>

//--//////////////////////////////////////////////////////////////////////////
//--    local declarations          ///{{{1///////////////////////////////////

void print_usage( const char* aProgramName );

//--    local config                ///{{{1///////////////////////////////////

/* HOST_NAME_MAX may be missing, e.g. if you're running this on an MacOS X
 * machine. In that case, use MAXHOSTNAMELEN from <sys/param.h>. Otherwise 
 * generate an compiler error.
 */
#if !defined(HOST_NAME_MAX)
#	if defined(__APPLE__)
#		include <sys/param.h>
#		define HOST_NAME_MAX MAXHOSTNAMELEN
#	else  // !__APPLE__
#		error "HOST_NAME_MAX undefined!"
#	endif // ~ __APPLE__
#endif // ~ HOST_NAME_MAX

//--    main()                      ///{{{1///////////////////////////////////
int main( int aArgc, char* aArgv[] )
{
	// Check if the user supplied a command line argument.
	if( aArgc != 2 )
	{
		print_usage( aArgv[0] );
		return 1;
	}

	// The (only) argument is the remote host that we should resolve.
	const char* remoteHostName = aArgv[1];

	// Get the local host's name (i.e. the machine that the program is 
	// currently running on).
	const size_t kHostNameMaxLength = HOST_NAME_MAX+1;
	char localHostName[kHostNameMaxLength];

	if( -1 == gethostname( localHostName, kHostNameMaxLength ) )
	{
		perror( "gethostname(): " );
		return 1;
	}

	// Print the initial message
	printf( "Resolving `%s' from `%s':\n", remoteHostName, localHostName );

	// TODO : add your code here
	addrinfo *res; 
	addrinfo hints = {
		.ai_flags=0,
		.ai_family=AF_INET,
		.ai_socktype=SOCK_STREAM,
        .ai_protocol=IPPROTO_TCP,
        .ai_addrlen=0,
        .ai_addr=NULL,
        .ai_canonname=NULL,
        .ai_next=NULL
	};
	
	int s = getaddrinfo(remoteHostName, NULL, &hints, &res);

	if (s != 0) {
		// sad path
		fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(s));
		exit(EXIT_FAILURE);
	}

	for (addrinfo *resptr = res; resptr != NULL; resptr = res->ai_next) {
		// happy path
		if (resptr->ai_family == AF_INET) {
			sockaddr_in *inAddr = (sockaddr_in*) resptr->ai_addr;
			uint32_t ipNumber = inAddr->sin_addr.s_addr;
			u_int8_t b0 = 0xff & ipNumber;		    // byte 0 
			u_int8_t b1 = 0xff & (ipNumber >> 8*1); // byte 1
			u_int8_t b2 = 0xff & (ipNumber >> 8*2); // byte 2
			u_int8_t b3 = 0xff & (ipNumber >> 8*3); // byte 3
			printf("%s has address: %u.%u.%u.%u\n", remoteHostName, b0, b1, b2, b3);
		} else {
			printf("invalid socket family\n");
		}
	}

	freeaddrinfo(res);

	// Ok, we're done. Return success.
	return 0;
}


//--    print_usage()               ///{{{1///////////////////////////////////
void print_usage( const char* aProgramName )
{
	fprintf( stderr, "Usage: %s <hostname>\n", aProgramName );
}

//--///}}}1/////////////// vim:syntax=cpp:foldmethod=marker:ts=4:noexpandtab: 
