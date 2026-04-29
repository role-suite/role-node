import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace role. */
export namespace role {

    /** Namespace v1. */
    namespace v1 {

        /** Properties of an AuthUser. */
        interface IAuthUser {

            /** AuthUser id */
            id?: (number|Long|null);

            /** AuthUser name */
            name?: (string|null);

            /** AuthUser email */
            email?: (string|null);
        }

        /** Represents an AuthUser. */
        class AuthUser implements IAuthUser {

            /**
             * Constructs a new AuthUser.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IAuthUser);

            /** AuthUser id. */
            public id: (number|Long);

            /** AuthUser name. */
            public name: string;

            /** AuthUser email. */
            public email: string;

            /**
             * Creates a new AuthUser instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AuthUser instance
             */
            public static create(properties?: role.v1.IAuthUser): role.v1.AuthUser;

            /**
             * Encodes the specified AuthUser message. Does not implicitly {@link role.v1.AuthUser.verify|verify} messages.
             * @param message AuthUser message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IAuthUser, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AuthUser message, length delimited. Does not implicitly {@link role.v1.AuthUser.verify|verify} messages.
             * @param message AuthUser message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IAuthUser, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AuthUser message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AuthUser
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.AuthUser;

            /**
             * Decodes an AuthUser message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AuthUser
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.AuthUser;

            /**
             * Verifies an AuthUser message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AuthUser message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AuthUser
             */
            public static fromObject(object: { [k: string]: any }): role.v1.AuthUser;

            /**
             * Creates a plain object from an AuthUser message. Also converts values to other types if specified.
             * @param message AuthUser
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.AuthUser, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AuthUser to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for AuthUser
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an AuthWorkspace. */
        interface IAuthWorkspace {

            /** AuthWorkspace id */
            id?: (number|Long|null);

            /** AuthWorkspace legacyId */
            legacyId?: (number|Long|null);

            /** AuthWorkspace name */
            name?: (string|null);

            /** AuthWorkspace slug */
            slug?: (string|null);

            /** AuthWorkspace type */
            type?: (string|null);

            /** AuthWorkspace role */
            role?: (string|null);
        }

        /** Represents an AuthWorkspace. */
        class AuthWorkspace implements IAuthWorkspace {

            /**
             * Constructs a new AuthWorkspace.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IAuthWorkspace);

            /** AuthWorkspace id. */
            public id: (number|Long);

            /** AuthWorkspace legacyId. */
            public legacyId: (number|Long);

            /** AuthWorkspace name. */
            public name: string;

            /** AuthWorkspace slug. */
            public slug: string;

            /** AuthWorkspace type. */
            public type: string;

            /** AuthWorkspace role. */
            public role: string;

            /**
             * Creates a new AuthWorkspace instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AuthWorkspace instance
             */
            public static create(properties?: role.v1.IAuthWorkspace): role.v1.AuthWorkspace;

            /**
             * Encodes the specified AuthWorkspace message. Does not implicitly {@link role.v1.AuthWorkspace.verify|verify} messages.
             * @param message AuthWorkspace message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IAuthWorkspace, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AuthWorkspace message, length delimited. Does not implicitly {@link role.v1.AuthWorkspace.verify|verify} messages.
             * @param message AuthWorkspace message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IAuthWorkspace, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AuthWorkspace message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AuthWorkspace
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.AuthWorkspace;

            /**
             * Decodes an AuthWorkspace message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AuthWorkspace
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.AuthWorkspace;

            /**
             * Verifies an AuthWorkspace message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AuthWorkspace message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AuthWorkspace
             */
            public static fromObject(object: { [k: string]: any }): role.v1.AuthWorkspace;

            /**
             * Creates a plain object from an AuthWorkspace message. Also converts values to other types if specified.
             * @param message AuthWorkspace
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.AuthWorkspace, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AuthWorkspace to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for AuthWorkspace
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an AuthMembership. */
        interface IAuthMembership {

            /** AuthMembership workspaceId */
            workspaceId?: (number|Long|null);

            /** AuthMembership legacyId */
            legacyId?: (number|Long|null);

            /** AuthMembership name */
            name?: (string|null);

            /** AuthMembership slug */
            slug?: (string|null);

            /** AuthMembership type */
            type?: (string|null);

            /** AuthMembership role */
            role?: (string|null);
        }

        /** Represents an AuthMembership. */
        class AuthMembership implements IAuthMembership {

            /**
             * Constructs a new AuthMembership.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IAuthMembership);

            /** AuthMembership workspaceId. */
            public workspaceId: (number|Long);

            /** AuthMembership legacyId. */
            public legacyId: (number|Long);

            /** AuthMembership name. */
            public name: string;

            /** AuthMembership slug. */
            public slug: string;

            /** AuthMembership type. */
            public type: string;

            /** AuthMembership role. */
            public role: string;

            /**
             * Creates a new AuthMembership instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AuthMembership instance
             */
            public static create(properties?: role.v1.IAuthMembership): role.v1.AuthMembership;

            /**
             * Encodes the specified AuthMembership message. Does not implicitly {@link role.v1.AuthMembership.verify|verify} messages.
             * @param message AuthMembership message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IAuthMembership, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AuthMembership message, length delimited. Does not implicitly {@link role.v1.AuthMembership.verify|verify} messages.
             * @param message AuthMembership message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IAuthMembership, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AuthMembership message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AuthMembership
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.AuthMembership;

            /**
             * Decodes an AuthMembership message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AuthMembership
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.AuthMembership;

            /**
             * Verifies an AuthMembership message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AuthMembership message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AuthMembership
             */
            public static fromObject(object: { [k: string]: any }): role.v1.AuthMembership;

            /**
             * Creates a plain object from an AuthMembership message. Also converts values to other types if specified.
             * @param message AuthMembership
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.AuthMembership, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AuthMembership to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for AuthMembership
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an AuthTokens. */
        interface IAuthTokens {

            /** AuthTokens accessToken */
            accessToken?: (string|null);

            /** AuthTokens refreshToken */
            refreshToken?: (string|null);

            /** AuthTokens accessTokenTtlSeconds */
            accessTokenTtlSeconds?: (number|null);

            /** AuthTokens refreshTokenTtlSeconds */
            refreshTokenTtlSeconds?: (number|null);
        }

        /** Represents an AuthTokens. */
        class AuthTokens implements IAuthTokens {

            /**
             * Constructs a new AuthTokens.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IAuthTokens);

            /** AuthTokens accessToken. */
            public accessToken: string;

            /** AuthTokens refreshToken. */
            public refreshToken: string;

            /** AuthTokens accessTokenTtlSeconds. */
            public accessTokenTtlSeconds: number;

            /** AuthTokens refreshTokenTtlSeconds. */
            public refreshTokenTtlSeconds: number;

            /**
             * Creates a new AuthTokens instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AuthTokens instance
             */
            public static create(properties?: role.v1.IAuthTokens): role.v1.AuthTokens;

            /**
             * Encodes the specified AuthTokens message. Does not implicitly {@link role.v1.AuthTokens.verify|verify} messages.
             * @param message AuthTokens message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IAuthTokens, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AuthTokens message, length delimited. Does not implicitly {@link role.v1.AuthTokens.verify|verify} messages.
             * @param message AuthTokens message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IAuthTokens, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AuthTokens message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AuthTokens
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.AuthTokens;

            /**
             * Decodes an AuthTokens message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AuthTokens
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.AuthTokens;

            /**
             * Verifies an AuthTokens message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AuthTokens message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AuthTokens
             */
            public static fromObject(object: { [k: string]: any }): role.v1.AuthTokens;

            /**
             * Creates a plain object from an AuthTokens message. Also converts values to other types if specified.
             * @param message AuthTokens
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.AuthTokens, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AuthTokens to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for AuthTokens
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an AuthPayload. */
        interface IAuthPayload {

            /** AuthPayload user */
            user?: (role.v1.IAuthUser|null);

            /** AuthPayload workspace */
            workspace?: (role.v1.IAuthWorkspace|null);

            /** AuthPayload memberships */
            memberships?: (role.v1.IAuthMembership[]|null);

            /** AuthPayload tokens */
            tokens?: (role.v1.IAuthTokens|null);
        }

        /** Represents an AuthPayload. */
        class AuthPayload implements IAuthPayload {

            /**
             * Constructs a new AuthPayload.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IAuthPayload);

            /** AuthPayload user. */
            public user?: (role.v1.IAuthUser|null);

            /** AuthPayload workspace. */
            public workspace?: (role.v1.IAuthWorkspace|null);

            /** AuthPayload memberships. */
            public memberships: role.v1.IAuthMembership[];

            /** AuthPayload tokens. */
            public tokens?: (role.v1.IAuthTokens|null);

            /**
             * Creates a new AuthPayload instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AuthPayload instance
             */
            public static create(properties?: role.v1.IAuthPayload): role.v1.AuthPayload;

            /**
             * Encodes the specified AuthPayload message. Does not implicitly {@link role.v1.AuthPayload.verify|verify} messages.
             * @param message AuthPayload message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IAuthPayload, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AuthPayload message, length delimited. Does not implicitly {@link role.v1.AuthPayload.verify|verify} messages.
             * @param message AuthPayload message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IAuthPayload, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AuthPayload message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AuthPayload
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.AuthPayload;

            /**
             * Decodes an AuthPayload message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AuthPayload
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.AuthPayload;

            /**
             * Verifies an AuthPayload message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AuthPayload message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AuthPayload
             */
            public static fromObject(object: { [k: string]: any }): role.v1.AuthPayload;

            /**
             * Creates a plain object from an AuthPayload message. Also converts values to other types if specified.
             * @param message AuthPayload
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.AuthPayload, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AuthPayload to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for AuthPayload
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a RegisterRequest. */
        interface IRegisterRequest {

            /** RegisterRequest name */
            name?: (string|null);

            /** RegisterRequest email */
            email?: (string|null);

            /** RegisterRequest password */
            password?: (string|null);

            /** RegisterRequest accountType */
            accountType?: (string|null);

            /** RegisterRequest teamName */
            teamName?: (string|null);
        }

        /** Represents a RegisterRequest. */
        class RegisterRequest implements IRegisterRequest {

            /**
             * Constructs a new RegisterRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IRegisterRequest);

            /** RegisterRequest name. */
            public name: string;

            /** RegisterRequest email. */
            public email: string;

            /** RegisterRequest password. */
            public password: string;

            /** RegisterRequest accountType. */
            public accountType: string;

            /** RegisterRequest teamName. */
            public teamName: string;

            /**
             * Creates a new RegisterRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns RegisterRequest instance
             */
            public static create(properties?: role.v1.IRegisterRequest): role.v1.RegisterRequest;

            /**
             * Encodes the specified RegisterRequest message. Does not implicitly {@link role.v1.RegisterRequest.verify|verify} messages.
             * @param message RegisterRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IRegisterRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RegisterRequest message, length delimited. Does not implicitly {@link role.v1.RegisterRequest.verify|verify} messages.
             * @param message RegisterRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IRegisterRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RegisterRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RegisterRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.RegisterRequest;

            /**
             * Decodes a RegisterRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RegisterRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.RegisterRequest;

            /**
             * Verifies a RegisterRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a RegisterRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns RegisterRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.RegisterRequest;

            /**
             * Creates a plain object from a RegisterRequest message. Also converts values to other types if specified.
             * @param message RegisterRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.RegisterRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this RegisterRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for RegisterRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a LoginRequest. */
        interface ILoginRequest {

            /** LoginRequest email */
            email?: (string|null);

            /** LoginRequest password */
            password?: (string|null);
        }

        /** Represents a LoginRequest. */
        class LoginRequest implements ILoginRequest {

            /**
             * Constructs a new LoginRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ILoginRequest);

            /** LoginRequest email. */
            public email: string;

            /** LoginRequest password. */
            public password: string;

            /**
             * Creates a new LoginRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LoginRequest instance
             */
            public static create(properties?: role.v1.ILoginRequest): role.v1.LoginRequest;

            /**
             * Encodes the specified LoginRequest message. Does not implicitly {@link role.v1.LoginRequest.verify|verify} messages.
             * @param message LoginRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ILoginRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LoginRequest message, length delimited. Does not implicitly {@link role.v1.LoginRequest.verify|verify} messages.
             * @param message LoginRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ILoginRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LoginRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LoginRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.LoginRequest;

            /**
             * Decodes a LoginRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LoginRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.LoginRequest;

            /**
             * Verifies a LoginRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a LoginRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns LoginRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.LoginRequest;

            /**
             * Creates a plain object from a LoginRequest message. Also converts values to other types if specified.
             * @param message LoginRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.LoginRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this LoginRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for LoginRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a RefreshRequest. */
        interface IRefreshRequest {

            /** RefreshRequest refreshToken */
            refreshToken?: (string|null);
        }

        /** Represents a RefreshRequest. */
        class RefreshRequest implements IRefreshRequest {

            /**
             * Constructs a new RefreshRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IRefreshRequest);

            /** RefreshRequest refreshToken. */
            public refreshToken: string;

            /**
             * Creates a new RefreshRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns RefreshRequest instance
             */
            public static create(properties?: role.v1.IRefreshRequest): role.v1.RefreshRequest;

            /**
             * Encodes the specified RefreshRequest message. Does not implicitly {@link role.v1.RefreshRequest.verify|verify} messages.
             * @param message RefreshRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IRefreshRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RefreshRequest message, length delimited. Does not implicitly {@link role.v1.RefreshRequest.verify|verify} messages.
             * @param message RefreshRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IRefreshRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RefreshRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RefreshRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.RefreshRequest;

            /**
             * Decodes a RefreshRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RefreshRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.RefreshRequest;

            /**
             * Verifies a RefreshRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a RefreshRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns RefreshRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.RefreshRequest;

            /**
             * Creates a plain object from a RefreshRequest message. Also converts values to other types if specified.
             * @param message RefreshRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.RefreshRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this RefreshRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for RefreshRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a LogoutRequest. */
        interface ILogoutRequest {

            /** LogoutRequest refreshToken */
            refreshToken?: (string|null);
        }

        /** Represents a LogoutRequest. */
        class LogoutRequest implements ILogoutRequest {

            /**
             * Constructs a new LogoutRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ILogoutRequest);

            /** LogoutRequest refreshToken. */
            public refreshToken: string;

            /**
             * Creates a new LogoutRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LogoutRequest instance
             */
            public static create(properties?: role.v1.ILogoutRequest): role.v1.LogoutRequest;

            /**
             * Encodes the specified LogoutRequest message. Does not implicitly {@link role.v1.LogoutRequest.verify|verify} messages.
             * @param message LogoutRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ILogoutRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LogoutRequest message, length delimited. Does not implicitly {@link role.v1.LogoutRequest.verify|verify} messages.
             * @param message LogoutRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ILogoutRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LogoutRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LogoutRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.LogoutRequest;

            /**
             * Decodes a LogoutRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LogoutRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.LogoutRequest;

            /**
             * Verifies a LogoutRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a LogoutRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns LogoutRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.LogoutRequest;

            /**
             * Creates a plain object from a LogoutRequest message. Also converts values to other types if specified.
             * @param message LogoutRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.LogoutRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this LogoutRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for LogoutRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a LogoutResponse. */
        interface ILogoutResponse {

            /** LogoutResponse status */
            status?: (string|null);
        }

        /** Represents a LogoutResponse. */
        class LogoutResponse implements ILogoutResponse {

            /**
             * Constructs a new LogoutResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ILogoutResponse);

            /** LogoutResponse status. */
            public status: string;

            /**
             * Creates a new LogoutResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LogoutResponse instance
             */
            public static create(properties?: role.v1.ILogoutResponse): role.v1.LogoutResponse;

            /**
             * Encodes the specified LogoutResponse message. Does not implicitly {@link role.v1.LogoutResponse.verify|verify} messages.
             * @param message LogoutResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ILogoutResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LogoutResponse message, length delimited. Does not implicitly {@link role.v1.LogoutResponse.verify|verify} messages.
             * @param message LogoutResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ILogoutResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LogoutResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LogoutResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.LogoutResponse;

            /**
             * Decodes a LogoutResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LogoutResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.LogoutResponse;

            /**
             * Verifies a LogoutResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a LogoutResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns LogoutResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.LogoutResponse;

            /**
             * Creates a plain object from a LogoutResponse message. Also converts values to other types if specified.
             * @param message LogoutResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.LogoutResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this LogoutResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for LogoutResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a MeRequest. */
        interface IMeRequest {
        }

        /** Represents a MeRequest. */
        class MeRequest implements IMeRequest {

            /**
             * Constructs a new MeRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IMeRequest);

            /**
             * Creates a new MeRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MeRequest instance
             */
            public static create(properties?: role.v1.IMeRequest): role.v1.MeRequest;

            /**
             * Encodes the specified MeRequest message. Does not implicitly {@link role.v1.MeRequest.verify|verify} messages.
             * @param message MeRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IMeRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MeRequest message, length delimited. Does not implicitly {@link role.v1.MeRequest.verify|verify} messages.
             * @param message MeRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IMeRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MeRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MeRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.MeRequest;

            /**
             * Decodes a MeRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MeRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.MeRequest;

            /**
             * Verifies a MeRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a MeRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MeRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.MeRequest;

            /**
             * Creates a plain object from a MeRequest message. Also converts values to other types if specified.
             * @param message MeRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.MeRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MeRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for MeRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a MeResponse. */
        interface IMeResponse {

            /** MeResponse user */
            user?: (role.v1.IAuthUser|null);

            /** MeResponse workspace */
            workspace?: (role.v1.IAuthWorkspace|null);

            /** MeResponse memberships */
            memberships?: (role.v1.IAuthMembership[]|null);
        }

        /** Represents a MeResponse. */
        class MeResponse implements IMeResponse {

            /**
             * Constructs a new MeResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IMeResponse);

            /** MeResponse user. */
            public user?: (role.v1.IAuthUser|null);

            /** MeResponse workspace. */
            public workspace?: (role.v1.IAuthWorkspace|null);

            /** MeResponse memberships. */
            public memberships: role.v1.IAuthMembership[];

            /**
             * Creates a new MeResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MeResponse instance
             */
            public static create(properties?: role.v1.IMeResponse): role.v1.MeResponse;

            /**
             * Encodes the specified MeResponse message. Does not implicitly {@link role.v1.MeResponse.verify|verify} messages.
             * @param message MeResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IMeResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MeResponse message, length delimited. Does not implicitly {@link role.v1.MeResponse.verify|verify} messages.
             * @param message MeResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IMeResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MeResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MeResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.MeResponse;

            /**
             * Decodes a MeResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MeResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.MeResponse;

            /**
             * Verifies a MeResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a MeResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MeResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.MeResponse;

            /**
             * Creates a plain object from a MeResponse message. Also converts values to other types if specified.
             * @param message MeResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.MeResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MeResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for MeResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Represents an AuthService */
        class AuthService extends $protobuf.rpc.Service {

            /**
             * Constructs a new AuthService service.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             */
            constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

            /**
             * Creates new AuthService service using the specified rpc implementation.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             * @returns RPC service. Useful where requests and/or responses are streamed.
             */
            public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): AuthService;

            /**
             * Calls Register.
             * @param request RegisterRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and AuthPayload
             */
            public register(request: role.v1.IRegisterRequest, callback: role.v1.AuthService.RegisterCallback): void;

            /**
             * Calls Register.
             * @param request RegisterRequest message or plain object
             * @returns Promise
             */
            public register(request: role.v1.IRegisterRequest): Promise<role.v1.AuthPayload>;

            /**
             * Calls Login.
             * @param request LoginRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and AuthPayload
             */
            public login(request: role.v1.ILoginRequest, callback: role.v1.AuthService.LoginCallback): void;

            /**
             * Calls Login.
             * @param request LoginRequest message or plain object
             * @returns Promise
             */
            public login(request: role.v1.ILoginRequest): Promise<role.v1.AuthPayload>;

            /**
             * Calls Refresh.
             * @param request RefreshRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and AuthPayload
             */
            public refresh(request: role.v1.IRefreshRequest, callback: role.v1.AuthService.RefreshCallback): void;

            /**
             * Calls Refresh.
             * @param request RefreshRequest message or plain object
             * @returns Promise
             */
            public refresh(request: role.v1.IRefreshRequest): Promise<role.v1.AuthPayload>;

            /**
             * Calls Logout.
             * @param request LogoutRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and LogoutResponse
             */
            public logout(request: role.v1.ILogoutRequest, callback: role.v1.AuthService.LogoutCallback): void;

            /**
             * Calls Logout.
             * @param request LogoutRequest message or plain object
             * @returns Promise
             */
            public logout(request: role.v1.ILogoutRequest): Promise<role.v1.LogoutResponse>;

            /**
             * Calls Me.
             * @param request MeRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and MeResponse
             */
            public me(request: role.v1.IMeRequest, callback: role.v1.AuthService.MeCallback): void;

            /**
             * Calls Me.
             * @param request MeRequest message or plain object
             * @returns Promise
             */
            public me(request: role.v1.IMeRequest): Promise<role.v1.MeResponse>;
        }

        namespace AuthService {

            /**
             * Callback as used by {@link role.v1.AuthService#register}.
             * @param error Error, if any
             * @param [response] AuthPayload
             */
            type RegisterCallback = (error: (Error|null), response?: role.v1.AuthPayload) => void;

            /**
             * Callback as used by {@link role.v1.AuthService#login}.
             * @param error Error, if any
             * @param [response] AuthPayload
             */
            type LoginCallback = (error: (Error|null), response?: role.v1.AuthPayload) => void;

            /**
             * Callback as used by {@link role.v1.AuthService#refresh}.
             * @param error Error, if any
             * @param [response] AuthPayload
             */
            type RefreshCallback = (error: (Error|null), response?: role.v1.AuthPayload) => void;

            /**
             * Callback as used by {@link role.v1.AuthService#logout}.
             * @param error Error, if any
             * @param [response] LogoutResponse
             */
            type LogoutCallback = (error: (Error|null), response?: role.v1.LogoutResponse) => void;

            /**
             * Callback as used by {@link role.v1.AuthService#me}.
             * @param error Error, if any
             * @param [response] MeResponse
             */
            type MeCallback = (error: (Error|null), response?: role.v1.MeResponse) => void;
        }

        /** Properties of a CollectionItem. */
        interface ICollectionItem {

            /** CollectionItem id */
            id?: (number|Long|null);

            /** CollectionItem legacyId */
            legacyId?: (number|Long|null);

            /** CollectionItem workspaceId */
            workspaceId?: (number|Long|null);

            /** CollectionItem name */
            name?: (string|null);

            /** CollectionItem description */
            description?: (string|null);

            /** CollectionItem createdByUserId */
            createdByUserId?: (number|Long|null);

            /** CollectionItem createdAt */
            createdAt?: (string|null);

            /** CollectionItem updatedAt */
            updatedAt?: (string|null);
        }

        /** Represents a CollectionItem. */
        class CollectionItem implements ICollectionItem {

            /**
             * Constructs a new CollectionItem.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionItem);

            /** CollectionItem id. */
            public id: (number|Long);

            /** CollectionItem legacyId. */
            public legacyId: (number|Long);

            /** CollectionItem workspaceId. */
            public workspaceId: (number|Long);

            /** CollectionItem name. */
            public name: string;

            /** CollectionItem description. */
            public description: string;

            /** CollectionItem createdByUserId. */
            public createdByUserId: (number|Long);

            /** CollectionItem createdAt. */
            public createdAt: string;

            /** CollectionItem updatedAt. */
            public updatedAt: string;

            /**
             * Creates a new CollectionItem instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionItem instance
             */
            public static create(properties?: role.v1.ICollectionItem): role.v1.CollectionItem;

            /**
             * Encodes the specified CollectionItem message. Does not implicitly {@link role.v1.CollectionItem.verify|verify} messages.
             * @param message CollectionItem message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionItem, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionItem message, length delimited. Does not implicitly {@link role.v1.CollectionItem.verify|verify} messages.
             * @param message CollectionItem message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionItem, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionItem message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionItem;

            /**
             * Decodes a CollectionItem message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionItem;

            /**
             * Verifies a CollectionItem message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionItem message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionItem
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionItem;

            /**
             * Creates a plain object from a CollectionItem message. Also converts values to other types if specified.
             * @param message CollectionItem
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionItem, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionItem to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionItem
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionEndpointItem. */
        interface ICollectionEndpointItem {

            /** CollectionEndpointItem id */
            id?: (number|Long|null);

            /** CollectionEndpointItem collectionId */
            collectionId?: (number|Long|null);

            /** CollectionEndpointItem folderId */
            folderId?: (number|Long|null);

            /** CollectionEndpointItem name */
            name?: (string|null);

            /** CollectionEndpointItem method */
            method?: (string|null);

            /** CollectionEndpointItem url */
            url?: (string|null);

            /** CollectionEndpointItem headersJson */
            headersJson?: (string|null);

            /** CollectionEndpointItem queryParamsJson */
            queryParamsJson?: (string|null);

            /** CollectionEndpointItem bodyJson */
            bodyJson?: (string|null);

            /** CollectionEndpointItem authJson */
            authJson?: (string|null);

            /** CollectionEndpointItem position */
            position?: (number|null);

            /** CollectionEndpointItem createdByUserId */
            createdByUserId?: (number|Long|null);

            /** CollectionEndpointItem createdAt */
            createdAt?: (string|null);

            /** CollectionEndpointItem updatedAt */
            updatedAt?: (string|null);
        }

        /** Represents a CollectionEndpointItem. */
        class CollectionEndpointItem implements ICollectionEndpointItem {

            /**
             * Constructs a new CollectionEndpointItem.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionEndpointItem);

            /** CollectionEndpointItem id. */
            public id: (number|Long);

            /** CollectionEndpointItem collectionId. */
            public collectionId: (number|Long);

            /** CollectionEndpointItem folderId. */
            public folderId: (number|Long);

            /** CollectionEndpointItem name. */
            public name: string;

            /** CollectionEndpointItem method. */
            public method: string;

            /** CollectionEndpointItem url. */
            public url: string;

            /** CollectionEndpointItem headersJson. */
            public headersJson: string;

            /** CollectionEndpointItem queryParamsJson. */
            public queryParamsJson: string;

            /** CollectionEndpointItem bodyJson. */
            public bodyJson: string;

            /** CollectionEndpointItem authJson. */
            public authJson: string;

            /** CollectionEndpointItem position. */
            public position: number;

            /** CollectionEndpointItem createdByUserId. */
            public createdByUserId: (number|Long);

            /** CollectionEndpointItem createdAt. */
            public createdAt: string;

            /** CollectionEndpointItem updatedAt. */
            public updatedAt: string;

            /**
             * Creates a new CollectionEndpointItem instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionEndpointItem instance
             */
            public static create(properties?: role.v1.ICollectionEndpointItem): role.v1.CollectionEndpointItem;

            /**
             * Encodes the specified CollectionEndpointItem message. Does not implicitly {@link role.v1.CollectionEndpointItem.verify|verify} messages.
             * @param message CollectionEndpointItem message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionEndpointItem, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionEndpointItem message, length delimited. Does not implicitly {@link role.v1.CollectionEndpointItem.verify|verify} messages.
             * @param message CollectionEndpointItem message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionEndpointItem, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionEndpointItem message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionEndpointItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionEndpointItem;

            /**
             * Decodes a CollectionEndpointItem message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionEndpointItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionEndpointItem;

            /**
             * Verifies a CollectionEndpointItem message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionEndpointItem message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionEndpointItem
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionEndpointItem;

            /**
             * Creates a plain object from a CollectionEndpointItem message. Also converts values to other types if specified.
             * @param message CollectionEndpointItem
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionEndpointItem, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionEndpointItem to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionEndpointItem
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionFolderItem. */
        interface ICollectionFolderItem {

            /** CollectionFolderItem id */
            id?: (number|Long|null);

            /** CollectionFolderItem collectionId */
            collectionId?: (number|Long|null);

            /** CollectionFolderItem parentFolderId */
            parentFolderId?: (number|Long|null);

            /** CollectionFolderItem name */
            name?: (string|null);

            /** CollectionFolderItem position */
            position?: (number|null);

            /** CollectionFolderItem createdByUserId */
            createdByUserId?: (number|Long|null);

            /** CollectionFolderItem createdAt */
            createdAt?: (string|null);

            /** CollectionFolderItem updatedAt */
            updatedAt?: (string|null);
        }

        /** Represents a CollectionFolderItem. */
        class CollectionFolderItem implements ICollectionFolderItem {

            /**
             * Constructs a new CollectionFolderItem.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionFolderItem);

            /** CollectionFolderItem id. */
            public id: (number|Long);

            /** CollectionFolderItem collectionId. */
            public collectionId: (number|Long);

            /** CollectionFolderItem parentFolderId. */
            public parentFolderId: (number|Long);

            /** CollectionFolderItem name. */
            public name: string;

            /** CollectionFolderItem position. */
            public position: number;

            /** CollectionFolderItem createdByUserId. */
            public createdByUserId: (number|Long);

            /** CollectionFolderItem createdAt. */
            public createdAt: string;

            /** CollectionFolderItem updatedAt. */
            public updatedAt: string;

            /**
             * Creates a new CollectionFolderItem instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionFolderItem instance
             */
            public static create(properties?: role.v1.ICollectionFolderItem): role.v1.CollectionFolderItem;

            /**
             * Encodes the specified CollectionFolderItem message. Does not implicitly {@link role.v1.CollectionFolderItem.verify|verify} messages.
             * @param message CollectionFolderItem message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionFolderItem, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionFolderItem message, length delimited. Does not implicitly {@link role.v1.CollectionFolderItem.verify|verify} messages.
             * @param message CollectionFolderItem message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionFolderItem, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionFolderItem message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionFolderItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionFolderItem;

            /**
             * Decodes a CollectionFolderItem message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionFolderItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionFolderItem;

            /**
             * Verifies a CollectionFolderItem message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionFolderItem message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionFolderItem
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionFolderItem;

            /**
             * Creates a plain object from a CollectionFolderItem message. Also converts values to other types if specified.
             * @param message CollectionFolderItem
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionFolderItem, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionFolderItem to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionFolderItem
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionExampleItem. */
        interface ICollectionExampleItem {

            /** CollectionExampleItem id */
            id?: (number|Long|null);

            /** CollectionExampleItem endpointId */
            endpointId?: (number|Long|null);

            /** CollectionExampleItem name */
            name?: (string|null);

            /** CollectionExampleItem statusCode */
            statusCode?: (number|null);

            /** CollectionExampleItem headersJson */
            headersJson?: (string|null);

            /** CollectionExampleItem body */
            body?: (string|null);

            /** CollectionExampleItem position */
            position?: (number|null);

            /** CollectionExampleItem createdByUserId */
            createdByUserId?: (number|Long|null);

            /** CollectionExampleItem createdAt */
            createdAt?: (string|null);

            /** CollectionExampleItem updatedAt */
            updatedAt?: (string|null);
        }

        /** Represents a CollectionExampleItem. */
        class CollectionExampleItem implements ICollectionExampleItem {

            /**
             * Constructs a new CollectionExampleItem.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionExampleItem);

            /** CollectionExampleItem id. */
            public id: (number|Long);

            /** CollectionExampleItem endpointId. */
            public endpointId: (number|Long);

            /** CollectionExampleItem name. */
            public name: string;

            /** CollectionExampleItem statusCode. */
            public statusCode: number;

            /** CollectionExampleItem headersJson. */
            public headersJson: string;

            /** CollectionExampleItem body. */
            public body: string;

            /** CollectionExampleItem position. */
            public position: number;

            /** CollectionExampleItem createdByUserId. */
            public createdByUserId: (number|Long);

            /** CollectionExampleItem createdAt. */
            public createdAt: string;

            /** CollectionExampleItem updatedAt. */
            public updatedAt: string;

            /**
             * Creates a new CollectionExampleItem instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionExampleItem instance
             */
            public static create(properties?: role.v1.ICollectionExampleItem): role.v1.CollectionExampleItem;

            /**
             * Encodes the specified CollectionExampleItem message. Does not implicitly {@link role.v1.CollectionExampleItem.verify|verify} messages.
             * @param message CollectionExampleItem message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionExampleItem, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionExampleItem message, length delimited. Does not implicitly {@link role.v1.CollectionExampleItem.verify|verify} messages.
             * @param message CollectionExampleItem message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionExampleItem, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionExampleItem message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionExampleItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionExampleItem;

            /**
             * Decodes a CollectionExampleItem message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionExampleItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionExampleItem;

            /**
             * Verifies a CollectionExampleItem message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionExampleItem message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionExampleItem
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionExampleItem;

            /**
             * Creates a plain object from a CollectionExampleItem message. Also converts values to other types if specified.
             * @param message CollectionExampleItem
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionExampleItem, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionExampleItem to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionExampleItem
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionsListRequest. */
        interface ICollectionsListRequest {

            /** CollectionsListRequest workspaceId */
            workspaceId?: (number|Long|null);
        }

        /** Represents a CollectionsListRequest. */
        class CollectionsListRequest implements ICollectionsListRequest {

            /**
             * Constructs a new CollectionsListRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionsListRequest);

            /** CollectionsListRequest workspaceId. */
            public workspaceId: (number|Long);

            /**
             * Creates a new CollectionsListRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionsListRequest instance
             */
            public static create(properties?: role.v1.ICollectionsListRequest): role.v1.CollectionsListRequest;

            /**
             * Encodes the specified CollectionsListRequest message. Does not implicitly {@link role.v1.CollectionsListRequest.verify|verify} messages.
             * @param message CollectionsListRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionsListRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionsListRequest message, length delimited. Does not implicitly {@link role.v1.CollectionsListRequest.verify|verify} messages.
             * @param message CollectionsListRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionsListRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionsListRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionsListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionsListRequest;

            /**
             * Decodes a CollectionsListRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionsListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionsListRequest;

            /**
             * Verifies a CollectionsListRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionsListRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionsListRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionsListRequest;

            /**
             * Creates a plain object from a CollectionsListRequest message. Also converts values to other types if specified.
             * @param message CollectionsListRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionsListRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionsListRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionsListRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionByIdRequest. */
        interface ICollectionByIdRequest {

            /** CollectionByIdRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** CollectionByIdRequest collectionId */
            collectionId?: (number|Long|null);
        }

        /** Represents a CollectionByIdRequest. */
        class CollectionByIdRequest implements ICollectionByIdRequest {

            /**
             * Constructs a new CollectionByIdRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionByIdRequest);

            /** CollectionByIdRequest workspaceId. */
            public workspaceId: (number|Long);

            /** CollectionByIdRequest collectionId. */
            public collectionId: (number|Long);

            /**
             * Creates a new CollectionByIdRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionByIdRequest instance
             */
            public static create(properties?: role.v1.ICollectionByIdRequest): role.v1.CollectionByIdRequest;

            /**
             * Encodes the specified CollectionByIdRequest message. Does not implicitly {@link role.v1.CollectionByIdRequest.verify|verify} messages.
             * @param message CollectionByIdRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionByIdRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionByIdRequest message, length delimited. Does not implicitly {@link role.v1.CollectionByIdRequest.verify|verify} messages.
             * @param message CollectionByIdRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionByIdRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionByIdRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionByIdRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionByIdRequest;

            /**
             * Decodes a CollectionByIdRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionByIdRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionByIdRequest;

            /**
             * Verifies a CollectionByIdRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionByIdRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionByIdRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionByIdRequest;

            /**
             * Creates a plain object from a CollectionByIdRequest message. Also converts values to other types if specified.
             * @param message CollectionByIdRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionByIdRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionByIdRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionByIdRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionCreateRequest. */
        interface ICollectionCreateRequest {

            /** CollectionCreateRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** CollectionCreateRequest name */
            name?: (string|null);

            /** CollectionCreateRequest description */
            description?: (string|null);
        }

        /** Represents a CollectionCreateRequest. */
        class CollectionCreateRequest implements ICollectionCreateRequest {

            /**
             * Constructs a new CollectionCreateRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionCreateRequest);

            /** CollectionCreateRequest workspaceId. */
            public workspaceId: (number|Long);

            /** CollectionCreateRequest name. */
            public name: string;

            /** CollectionCreateRequest description. */
            public description: string;

            /**
             * Creates a new CollectionCreateRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionCreateRequest instance
             */
            public static create(properties?: role.v1.ICollectionCreateRequest): role.v1.CollectionCreateRequest;

            /**
             * Encodes the specified CollectionCreateRequest message. Does not implicitly {@link role.v1.CollectionCreateRequest.verify|verify} messages.
             * @param message CollectionCreateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionCreateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionCreateRequest message, length delimited. Does not implicitly {@link role.v1.CollectionCreateRequest.verify|verify} messages.
             * @param message CollectionCreateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionCreateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionCreateRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionCreateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionCreateRequest;

            /**
             * Decodes a CollectionCreateRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionCreateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionCreateRequest;

            /**
             * Verifies a CollectionCreateRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionCreateRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionCreateRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionCreateRequest;

            /**
             * Creates a plain object from a CollectionCreateRequest message. Also converts values to other types if specified.
             * @param message CollectionCreateRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionCreateRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionCreateRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionCreateRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionUpdateRequest. */
        interface ICollectionUpdateRequest {

            /** CollectionUpdateRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** CollectionUpdateRequest collectionId */
            collectionId?: (number|Long|null);

            /** CollectionUpdateRequest name */
            name?: (string|null);

            /** CollectionUpdateRequest description */
            description?: (string|null);
        }

        /** Represents a CollectionUpdateRequest. */
        class CollectionUpdateRequest implements ICollectionUpdateRequest {

            /**
             * Constructs a new CollectionUpdateRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionUpdateRequest);

            /** CollectionUpdateRequest workspaceId. */
            public workspaceId: (number|Long);

            /** CollectionUpdateRequest collectionId. */
            public collectionId: (number|Long);

            /** CollectionUpdateRequest name. */
            public name: string;

            /** CollectionUpdateRequest description. */
            public description: string;

            /**
             * Creates a new CollectionUpdateRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionUpdateRequest instance
             */
            public static create(properties?: role.v1.ICollectionUpdateRequest): role.v1.CollectionUpdateRequest;

            /**
             * Encodes the specified CollectionUpdateRequest message. Does not implicitly {@link role.v1.CollectionUpdateRequest.verify|verify} messages.
             * @param message CollectionUpdateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionUpdateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionUpdateRequest message, length delimited. Does not implicitly {@link role.v1.CollectionUpdateRequest.verify|verify} messages.
             * @param message CollectionUpdateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionUpdateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionUpdateRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionUpdateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionUpdateRequest;

            /**
             * Decodes a CollectionUpdateRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionUpdateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionUpdateRequest;

            /**
             * Verifies a CollectionUpdateRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionUpdateRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionUpdateRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionUpdateRequest;

            /**
             * Creates a plain object from a CollectionUpdateRequest message. Also converts values to other types if specified.
             * @param message CollectionUpdateRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionUpdateRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionUpdateRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionUpdateRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionDeleteRequest. */
        interface ICollectionDeleteRequest {

            /** CollectionDeleteRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** CollectionDeleteRequest collectionId */
            collectionId?: (number|Long|null);
        }

        /** Represents a CollectionDeleteRequest. */
        class CollectionDeleteRequest implements ICollectionDeleteRequest {

            /**
             * Constructs a new CollectionDeleteRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionDeleteRequest);

            /** CollectionDeleteRequest workspaceId. */
            public workspaceId: (number|Long);

            /** CollectionDeleteRequest collectionId. */
            public collectionId: (number|Long);

            /**
             * Creates a new CollectionDeleteRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionDeleteRequest instance
             */
            public static create(properties?: role.v1.ICollectionDeleteRequest): role.v1.CollectionDeleteRequest;

            /**
             * Encodes the specified CollectionDeleteRequest message. Does not implicitly {@link role.v1.CollectionDeleteRequest.verify|verify} messages.
             * @param message CollectionDeleteRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionDeleteRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionDeleteRequest message, length delimited. Does not implicitly {@link role.v1.CollectionDeleteRequest.verify|verify} messages.
             * @param message CollectionDeleteRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionDeleteRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionDeleteRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionDeleteRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionDeleteRequest;

            /**
             * Decodes a CollectionDeleteRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionDeleteRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionDeleteRequest;

            /**
             * Verifies a CollectionDeleteRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionDeleteRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionDeleteRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionDeleteRequest;

            /**
             * Creates a plain object from a CollectionDeleteRequest message. Also converts values to other types if specified.
             * @param message CollectionDeleteRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionDeleteRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionDeleteRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionDeleteRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionEndpointByIdRequest. */
        interface ICollectionEndpointByIdRequest {

            /** CollectionEndpointByIdRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** CollectionEndpointByIdRequest collectionId */
            collectionId?: (number|Long|null);

            /** CollectionEndpointByIdRequest endpointId */
            endpointId?: (number|Long|null);
        }

        /** Represents a CollectionEndpointByIdRequest. */
        class CollectionEndpointByIdRequest implements ICollectionEndpointByIdRequest {

            /**
             * Constructs a new CollectionEndpointByIdRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionEndpointByIdRequest);

            /** CollectionEndpointByIdRequest workspaceId. */
            public workspaceId: (number|Long);

            /** CollectionEndpointByIdRequest collectionId. */
            public collectionId: (number|Long);

            /** CollectionEndpointByIdRequest endpointId. */
            public endpointId: (number|Long);

            /**
             * Creates a new CollectionEndpointByIdRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionEndpointByIdRequest instance
             */
            public static create(properties?: role.v1.ICollectionEndpointByIdRequest): role.v1.CollectionEndpointByIdRequest;

            /**
             * Encodes the specified CollectionEndpointByIdRequest message. Does not implicitly {@link role.v1.CollectionEndpointByIdRequest.verify|verify} messages.
             * @param message CollectionEndpointByIdRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionEndpointByIdRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionEndpointByIdRequest message, length delimited. Does not implicitly {@link role.v1.CollectionEndpointByIdRequest.verify|verify} messages.
             * @param message CollectionEndpointByIdRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionEndpointByIdRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionEndpointByIdRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionEndpointByIdRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionEndpointByIdRequest;

            /**
             * Decodes a CollectionEndpointByIdRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionEndpointByIdRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionEndpointByIdRequest;

            /**
             * Verifies a CollectionEndpointByIdRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionEndpointByIdRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionEndpointByIdRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionEndpointByIdRequest;

            /**
             * Creates a plain object from a CollectionEndpointByIdRequest message. Also converts values to other types if specified.
             * @param message CollectionEndpointByIdRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionEndpointByIdRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionEndpointByIdRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionEndpointByIdRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionEndpointCreateRequest. */
        interface ICollectionEndpointCreateRequest {

            /** CollectionEndpointCreateRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** CollectionEndpointCreateRequest collectionId */
            collectionId?: (number|Long|null);

            /** CollectionEndpointCreateRequest folderId */
            folderId?: (number|Long|null);

            /** CollectionEndpointCreateRequest name */
            name?: (string|null);

            /** CollectionEndpointCreateRequest method */
            method?: (string|null);

            /** CollectionEndpointCreateRequest url */
            url?: (string|null);

            /** CollectionEndpointCreateRequest headersJson */
            headersJson?: (string|null);

            /** CollectionEndpointCreateRequest queryParamsJson */
            queryParamsJson?: (string|null);

            /** CollectionEndpointCreateRequest bodyJson */
            bodyJson?: (string|null);

            /** CollectionEndpointCreateRequest authJson */
            authJson?: (string|null);

            /** CollectionEndpointCreateRequest position */
            position?: (number|null);
        }

        /** Represents a CollectionEndpointCreateRequest. */
        class CollectionEndpointCreateRequest implements ICollectionEndpointCreateRequest {

            /**
             * Constructs a new CollectionEndpointCreateRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionEndpointCreateRequest);

            /** CollectionEndpointCreateRequest workspaceId. */
            public workspaceId: (number|Long);

            /** CollectionEndpointCreateRequest collectionId. */
            public collectionId: (number|Long);

            /** CollectionEndpointCreateRequest folderId. */
            public folderId: (number|Long);

            /** CollectionEndpointCreateRequest name. */
            public name: string;

            /** CollectionEndpointCreateRequest method. */
            public method: string;

            /** CollectionEndpointCreateRequest url. */
            public url: string;

            /** CollectionEndpointCreateRequest headersJson. */
            public headersJson: string;

            /** CollectionEndpointCreateRequest queryParamsJson. */
            public queryParamsJson: string;

            /** CollectionEndpointCreateRequest bodyJson. */
            public bodyJson: string;

            /** CollectionEndpointCreateRequest authJson. */
            public authJson: string;

            /** CollectionEndpointCreateRequest position. */
            public position: number;

            /**
             * Creates a new CollectionEndpointCreateRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionEndpointCreateRequest instance
             */
            public static create(properties?: role.v1.ICollectionEndpointCreateRequest): role.v1.CollectionEndpointCreateRequest;

            /**
             * Encodes the specified CollectionEndpointCreateRequest message. Does not implicitly {@link role.v1.CollectionEndpointCreateRequest.verify|verify} messages.
             * @param message CollectionEndpointCreateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionEndpointCreateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionEndpointCreateRequest message, length delimited. Does not implicitly {@link role.v1.CollectionEndpointCreateRequest.verify|verify} messages.
             * @param message CollectionEndpointCreateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionEndpointCreateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionEndpointCreateRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionEndpointCreateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionEndpointCreateRequest;

            /**
             * Decodes a CollectionEndpointCreateRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionEndpointCreateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionEndpointCreateRequest;

            /**
             * Verifies a CollectionEndpointCreateRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionEndpointCreateRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionEndpointCreateRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionEndpointCreateRequest;

            /**
             * Creates a plain object from a CollectionEndpointCreateRequest message. Also converts values to other types if specified.
             * @param message CollectionEndpointCreateRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionEndpointCreateRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionEndpointCreateRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionEndpointCreateRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionEndpointUpdateRequest. */
        interface ICollectionEndpointUpdateRequest {

            /** CollectionEndpointUpdateRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** CollectionEndpointUpdateRequest collectionId */
            collectionId?: (number|Long|null);

            /** CollectionEndpointUpdateRequest endpointId */
            endpointId?: (number|Long|null);

            /** CollectionEndpointUpdateRequest folderId */
            folderId?: (number|Long|null);

            /** CollectionEndpointUpdateRequest name */
            name?: (string|null);

            /** CollectionEndpointUpdateRequest method */
            method?: (string|null);

            /** CollectionEndpointUpdateRequest url */
            url?: (string|null);

            /** CollectionEndpointUpdateRequest headersJson */
            headersJson?: (string|null);

            /** CollectionEndpointUpdateRequest queryParamsJson */
            queryParamsJson?: (string|null);

            /** CollectionEndpointUpdateRequest bodyJson */
            bodyJson?: (string|null);

            /** CollectionEndpointUpdateRequest authJson */
            authJson?: (string|null);

            /** CollectionEndpointUpdateRequest position */
            position?: (number|null);
        }

        /** Represents a CollectionEndpointUpdateRequest. */
        class CollectionEndpointUpdateRequest implements ICollectionEndpointUpdateRequest {

            /**
             * Constructs a new CollectionEndpointUpdateRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionEndpointUpdateRequest);

            /** CollectionEndpointUpdateRequest workspaceId. */
            public workspaceId: (number|Long);

            /** CollectionEndpointUpdateRequest collectionId. */
            public collectionId: (number|Long);

            /** CollectionEndpointUpdateRequest endpointId. */
            public endpointId: (number|Long);

            /** CollectionEndpointUpdateRequest folderId. */
            public folderId: (number|Long);

            /** CollectionEndpointUpdateRequest name. */
            public name: string;

            /** CollectionEndpointUpdateRequest method. */
            public method: string;

            /** CollectionEndpointUpdateRequest url. */
            public url: string;

            /** CollectionEndpointUpdateRequest headersJson. */
            public headersJson: string;

            /** CollectionEndpointUpdateRequest queryParamsJson. */
            public queryParamsJson: string;

            /** CollectionEndpointUpdateRequest bodyJson. */
            public bodyJson: string;

            /** CollectionEndpointUpdateRequest authJson. */
            public authJson: string;

            /** CollectionEndpointUpdateRequest position. */
            public position: number;

            /**
             * Creates a new CollectionEndpointUpdateRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionEndpointUpdateRequest instance
             */
            public static create(properties?: role.v1.ICollectionEndpointUpdateRequest): role.v1.CollectionEndpointUpdateRequest;

            /**
             * Encodes the specified CollectionEndpointUpdateRequest message. Does not implicitly {@link role.v1.CollectionEndpointUpdateRequest.verify|verify} messages.
             * @param message CollectionEndpointUpdateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionEndpointUpdateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionEndpointUpdateRequest message, length delimited. Does not implicitly {@link role.v1.CollectionEndpointUpdateRequest.verify|verify} messages.
             * @param message CollectionEndpointUpdateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionEndpointUpdateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionEndpointUpdateRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionEndpointUpdateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionEndpointUpdateRequest;

            /**
             * Decodes a CollectionEndpointUpdateRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionEndpointUpdateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionEndpointUpdateRequest;

            /**
             * Verifies a CollectionEndpointUpdateRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionEndpointUpdateRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionEndpointUpdateRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionEndpointUpdateRequest;

            /**
             * Creates a plain object from a CollectionEndpointUpdateRequest message. Also converts values to other types if specified.
             * @param message CollectionEndpointUpdateRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionEndpointUpdateRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionEndpointUpdateRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionEndpointUpdateRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionFolderByIdRequest. */
        interface ICollectionFolderByIdRequest {

            /** CollectionFolderByIdRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** CollectionFolderByIdRequest collectionId */
            collectionId?: (number|Long|null);

            /** CollectionFolderByIdRequest folderId */
            folderId?: (number|Long|null);
        }

        /** Represents a CollectionFolderByIdRequest. */
        class CollectionFolderByIdRequest implements ICollectionFolderByIdRequest {

            /**
             * Constructs a new CollectionFolderByIdRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionFolderByIdRequest);

            /** CollectionFolderByIdRequest workspaceId. */
            public workspaceId: (number|Long);

            /** CollectionFolderByIdRequest collectionId. */
            public collectionId: (number|Long);

            /** CollectionFolderByIdRequest folderId. */
            public folderId: (number|Long);

            /**
             * Creates a new CollectionFolderByIdRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionFolderByIdRequest instance
             */
            public static create(properties?: role.v1.ICollectionFolderByIdRequest): role.v1.CollectionFolderByIdRequest;

            /**
             * Encodes the specified CollectionFolderByIdRequest message. Does not implicitly {@link role.v1.CollectionFolderByIdRequest.verify|verify} messages.
             * @param message CollectionFolderByIdRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionFolderByIdRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionFolderByIdRequest message, length delimited. Does not implicitly {@link role.v1.CollectionFolderByIdRequest.verify|verify} messages.
             * @param message CollectionFolderByIdRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionFolderByIdRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionFolderByIdRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionFolderByIdRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionFolderByIdRequest;

            /**
             * Decodes a CollectionFolderByIdRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionFolderByIdRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionFolderByIdRequest;

            /**
             * Verifies a CollectionFolderByIdRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionFolderByIdRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionFolderByIdRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionFolderByIdRequest;

            /**
             * Creates a plain object from a CollectionFolderByIdRequest message. Also converts values to other types if specified.
             * @param message CollectionFolderByIdRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionFolderByIdRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionFolderByIdRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionFolderByIdRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionFolderCreateRequest. */
        interface ICollectionFolderCreateRequest {

            /** CollectionFolderCreateRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** CollectionFolderCreateRequest collectionId */
            collectionId?: (number|Long|null);

            /** CollectionFolderCreateRequest name */
            name?: (string|null);

            /** CollectionFolderCreateRequest parentFolderId */
            parentFolderId?: (number|Long|null);

            /** CollectionFolderCreateRequest position */
            position?: (number|null);
        }

        /** Represents a CollectionFolderCreateRequest. */
        class CollectionFolderCreateRequest implements ICollectionFolderCreateRequest {

            /**
             * Constructs a new CollectionFolderCreateRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionFolderCreateRequest);

            /** CollectionFolderCreateRequest workspaceId. */
            public workspaceId: (number|Long);

            /** CollectionFolderCreateRequest collectionId. */
            public collectionId: (number|Long);

            /** CollectionFolderCreateRequest name. */
            public name: string;

            /** CollectionFolderCreateRequest parentFolderId. */
            public parentFolderId: (number|Long);

            /** CollectionFolderCreateRequest position. */
            public position: number;

            /**
             * Creates a new CollectionFolderCreateRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionFolderCreateRequest instance
             */
            public static create(properties?: role.v1.ICollectionFolderCreateRequest): role.v1.CollectionFolderCreateRequest;

            /**
             * Encodes the specified CollectionFolderCreateRequest message. Does not implicitly {@link role.v1.CollectionFolderCreateRequest.verify|verify} messages.
             * @param message CollectionFolderCreateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionFolderCreateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionFolderCreateRequest message, length delimited. Does not implicitly {@link role.v1.CollectionFolderCreateRequest.verify|verify} messages.
             * @param message CollectionFolderCreateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionFolderCreateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionFolderCreateRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionFolderCreateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionFolderCreateRequest;

            /**
             * Decodes a CollectionFolderCreateRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionFolderCreateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionFolderCreateRequest;

            /**
             * Verifies a CollectionFolderCreateRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionFolderCreateRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionFolderCreateRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionFolderCreateRequest;

            /**
             * Creates a plain object from a CollectionFolderCreateRequest message. Also converts values to other types if specified.
             * @param message CollectionFolderCreateRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionFolderCreateRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionFolderCreateRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionFolderCreateRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionFolderUpdateRequest. */
        interface ICollectionFolderUpdateRequest {

            /** CollectionFolderUpdateRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** CollectionFolderUpdateRequest collectionId */
            collectionId?: (number|Long|null);

            /** CollectionFolderUpdateRequest folderId */
            folderId?: (number|Long|null);

            /** CollectionFolderUpdateRequest name */
            name?: (string|null);

            /** CollectionFolderUpdateRequest parentFolderId */
            parentFolderId?: (number|Long|null);

            /** CollectionFolderUpdateRequest position */
            position?: (number|null);
        }

        /** Represents a CollectionFolderUpdateRequest. */
        class CollectionFolderUpdateRequest implements ICollectionFolderUpdateRequest {

            /**
             * Constructs a new CollectionFolderUpdateRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionFolderUpdateRequest);

            /** CollectionFolderUpdateRequest workspaceId. */
            public workspaceId: (number|Long);

            /** CollectionFolderUpdateRequest collectionId. */
            public collectionId: (number|Long);

            /** CollectionFolderUpdateRequest folderId. */
            public folderId: (number|Long);

            /** CollectionFolderUpdateRequest name. */
            public name: string;

            /** CollectionFolderUpdateRequest parentFolderId. */
            public parentFolderId: (number|Long);

            /** CollectionFolderUpdateRequest position. */
            public position: number;

            /**
             * Creates a new CollectionFolderUpdateRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionFolderUpdateRequest instance
             */
            public static create(properties?: role.v1.ICollectionFolderUpdateRequest): role.v1.CollectionFolderUpdateRequest;

            /**
             * Encodes the specified CollectionFolderUpdateRequest message. Does not implicitly {@link role.v1.CollectionFolderUpdateRequest.verify|verify} messages.
             * @param message CollectionFolderUpdateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionFolderUpdateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionFolderUpdateRequest message, length delimited. Does not implicitly {@link role.v1.CollectionFolderUpdateRequest.verify|verify} messages.
             * @param message CollectionFolderUpdateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionFolderUpdateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionFolderUpdateRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionFolderUpdateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionFolderUpdateRequest;

            /**
             * Decodes a CollectionFolderUpdateRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionFolderUpdateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionFolderUpdateRequest;

            /**
             * Verifies a CollectionFolderUpdateRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionFolderUpdateRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionFolderUpdateRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionFolderUpdateRequest;

            /**
             * Creates a plain object from a CollectionFolderUpdateRequest message. Also converts values to other types if specified.
             * @param message CollectionFolderUpdateRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionFolderUpdateRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionFolderUpdateRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionFolderUpdateRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionExampleByIdRequest. */
        interface ICollectionExampleByIdRequest {

            /** CollectionExampleByIdRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** CollectionExampleByIdRequest collectionId */
            collectionId?: (number|Long|null);

            /** CollectionExampleByIdRequest endpointId */
            endpointId?: (number|Long|null);

            /** CollectionExampleByIdRequest exampleId */
            exampleId?: (number|Long|null);
        }

        /** Represents a CollectionExampleByIdRequest. */
        class CollectionExampleByIdRequest implements ICollectionExampleByIdRequest {

            /**
             * Constructs a new CollectionExampleByIdRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionExampleByIdRequest);

            /** CollectionExampleByIdRequest workspaceId. */
            public workspaceId: (number|Long);

            /** CollectionExampleByIdRequest collectionId. */
            public collectionId: (number|Long);

            /** CollectionExampleByIdRequest endpointId. */
            public endpointId: (number|Long);

            /** CollectionExampleByIdRequest exampleId. */
            public exampleId: (number|Long);

            /**
             * Creates a new CollectionExampleByIdRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionExampleByIdRequest instance
             */
            public static create(properties?: role.v1.ICollectionExampleByIdRequest): role.v1.CollectionExampleByIdRequest;

            /**
             * Encodes the specified CollectionExampleByIdRequest message. Does not implicitly {@link role.v1.CollectionExampleByIdRequest.verify|verify} messages.
             * @param message CollectionExampleByIdRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionExampleByIdRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionExampleByIdRequest message, length delimited. Does not implicitly {@link role.v1.CollectionExampleByIdRequest.verify|verify} messages.
             * @param message CollectionExampleByIdRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionExampleByIdRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionExampleByIdRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionExampleByIdRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionExampleByIdRequest;

            /**
             * Decodes a CollectionExampleByIdRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionExampleByIdRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionExampleByIdRequest;

            /**
             * Verifies a CollectionExampleByIdRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionExampleByIdRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionExampleByIdRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionExampleByIdRequest;

            /**
             * Creates a plain object from a CollectionExampleByIdRequest message. Also converts values to other types if specified.
             * @param message CollectionExampleByIdRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionExampleByIdRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionExampleByIdRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionExampleByIdRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionExampleCreateRequest. */
        interface ICollectionExampleCreateRequest {

            /** CollectionExampleCreateRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** CollectionExampleCreateRequest collectionId */
            collectionId?: (number|Long|null);

            /** CollectionExampleCreateRequest endpointId */
            endpointId?: (number|Long|null);

            /** CollectionExampleCreateRequest name */
            name?: (string|null);

            /** CollectionExampleCreateRequest statusCode */
            statusCode?: (number|null);

            /** CollectionExampleCreateRequest headersJson */
            headersJson?: (string|null);

            /** CollectionExampleCreateRequest body */
            body?: (string|null);

            /** CollectionExampleCreateRequest position */
            position?: (number|null);
        }

        /** Represents a CollectionExampleCreateRequest. */
        class CollectionExampleCreateRequest implements ICollectionExampleCreateRequest {

            /**
             * Constructs a new CollectionExampleCreateRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionExampleCreateRequest);

            /** CollectionExampleCreateRequest workspaceId. */
            public workspaceId: (number|Long);

            /** CollectionExampleCreateRequest collectionId. */
            public collectionId: (number|Long);

            /** CollectionExampleCreateRequest endpointId. */
            public endpointId: (number|Long);

            /** CollectionExampleCreateRequest name. */
            public name: string;

            /** CollectionExampleCreateRequest statusCode. */
            public statusCode: number;

            /** CollectionExampleCreateRequest headersJson. */
            public headersJson: string;

            /** CollectionExampleCreateRequest body. */
            public body: string;

            /** CollectionExampleCreateRequest position. */
            public position: number;

            /**
             * Creates a new CollectionExampleCreateRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionExampleCreateRequest instance
             */
            public static create(properties?: role.v1.ICollectionExampleCreateRequest): role.v1.CollectionExampleCreateRequest;

            /**
             * Encodes the specified CollectionExampleCreateRequest message. Does not implicitly {@link role.v1.CollectionExampleCreateRequest.verify|verify} messages.
             * @param message CollectionExampleCreateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionExampleCreateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionExampleCreateRequest message, length delimited. Does not implicitly {@link role.v1.CollectionExampleCreateRequest.verify|verify} messages.
             * @param message CollectionExampleCreateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionExampleCreateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionExampleCreateRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionExampleCreateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionExampleCreateRequest;

            /**
             * Decodes a CollectionExampleCreateRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionExampleCreateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionExampleCreateRequest;

            /**
             * Verifies a CollectionExampleCreateRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionExampleCreateRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionExampleCreateRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionExampleCreateRequest;

            /**
             * Creates a plain object from a CollectionExampleCreateRequest message. Also converts values to other types if specified.
             * @param message CollectionExampleCreateRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionExampleCreateRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionExampleCreateRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionExampleCreateRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionExampleUpdateRequest. */
        interface ICollectionExampleUpdateRequest {

            /** CollectionExampleUpdateRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** CollectionExampleUpdateRequest collectionId */
            collectionId?: (number|Long|null);

            /** CollectionExampleUpdateRequest endpointId */
            endpointId?: (number|Long|null);

            /** CollectionExampleUpdateRequest exampleId */
            exampleId?: (number|Long|null);

            /** CollectionExampleUpdateRequest name */
            name?: (string|null);

            /** CollectionExampleUpdateRequest statusCode */
            statusCode?: (number|null);

            /** CollectionExampleUpdateRequest headersJson */
            headersJson?: (string|null);

            /** CollectionExampleUpdateRequest body */
            body?: (string|null);

            /** CollectionExampleUpdateRequest position */
            position?: (number|null);
        }

        /** Represents a CollectionExampleUpdateRequest. */
        class CollectionExampleUpdateRequest implements ICollectionExampleUpdateRequest {

            /**
             * Constructs a new CollectionExampleUpdateRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionExampleUpdateRequest);

            /** CollectionExampleUpdateRequest workspaceId. */
            public workspaceId: (number|Long);

            /** CollectionExampleUpdateRequest collectionId. */
            public collectionId: (number|Long);

            /** CollectionExampleUpdateRequest endpointId. */
            public endpointId: (number|Long);

            /** CollectionExampleUpdateRequest exampleId. */
            public exampleId: (number|Long);

            /** CollectionExampleUpdateRequest name. */
            public name: string;

            /** CollectionExampleUpdateRequest statusCode. */
            public statusCode: number;

            /** CollectionExampleUpdateRequest headersJson. */
            public headersJson: string;

            /** CollectionExampleUpdateRequest body. */
            public body: string;

            /** CollectionExampleUpdateRequest position. */
            public position: number;

            /**
             * Creates a new CollectionExampleUpdateRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionExampleUpdateRequest instance
             */
            public static create(properties?: role.v1.ICollectionExampleUpdateRequest): role.v1.CollectionExampleUpdateRequest;

            /**
             * Encodes the specified CollectionExampleUpdateRequest message. Does not implicitly {@link role.v1.CollectionExampleUpdateRequest.verify|verify} messages.
             * @param message CollectionExampleUpdateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionExampleUpdateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionExampleUpdateRequest message, length delimited. Does not implicitly {@link role.v1.CollectionExampleUpdateRequest.verify|verify} messages.
             * @param message CollectionExampleUpdateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionExampleUpdateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionExampleUpdateRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionExampleUpdateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionExampleUpdateRequest;

            /**
             * Decodes a CollectionExampleUpdateRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionExampleUpdateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionExampleUpdateRequest;

            /**
             * Verifies a CollectionExampleUpdateRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionExampleUpdateRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionExampleUpdateRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionExampleUpdateRequest;

            /**
             * Creates a plain object from a CollectionExampleUpdateRequest message. Also converts values to other types if specified.
             * @param message CollectionExampleUpdateRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionExampleUpdateRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionExampleUpdateRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionExampleUpdateRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionItemResponse. */
        interface ICollectionItemResponse {

            /** CollectionItemResponse item */
            item?: (role.v1.ICollectionItem|null);
        }

        /** Represents a CollectionItemResponse. */
        class CollectionItemResponse implements ICollectionItemResponse {

            /**
             * Constructs a new CollectionItemResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionItemResponse);

            /** CollectionItemResponse item. */
            public item?: (role.v1.ICollectionItem|null);

            /**
             * Creates a new CollectionItemResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionItemResponse instance
             */
            public static create(properties?: role.v1.ICollectionItemResponse): role.v1.CollectionItemResponse;

            /**
             * Encodes the specified CollectionItemResponse message. Does not implicitly {@link role.v1.CollectionItemResponse.verify|verify} messages.
             * @param message CollectionItemResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionItemResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionItemResponse message, length delimited. Does not implicitly {@link role.v1.CollectionItemResponse.verify|verify} messages.
             * @param message CollectionItemResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionItemResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionItemResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionItemResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionItemResponse;

            /**
             * Decodes a CollectionItemResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionItemResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionItemResponse;

            /**
             * Verifies a CollectionItemResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionItemResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionItemResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionItemResponse;

            /**
             * Creates a plain object from a CollectionItemResponse message. Also converts values to other types if specified.
             * @param message CollectionItemResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionItemResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionItemResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionItemResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionItemsResponse. */
        interface ICollectionItemsResponse {

            /** CollectionItemsResponse items */
            items?: (role.v1.ICollectionItem[]|null);
        }

        /** Represents a CollectionItemsResponse. */
        class CollectionItemsResponse implements ICollectionItemsResponse {

            /**
             * Constructs a new CollectionItemsResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionItemsResponse);

            /** CollectionItemsResponse items. */
            public items: role.v1.ICollectionItem[];

            /**
             * Creates a new CollectionItemsResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionItemsResponse instance
             */
            public static create(properties?: role.v1.ICollectionItemsResponse): role.v1.CollectionItemsResponse;

            /**
             * Encodes the specified CollectionItemsResponse message. Does not implicitly {@link role.v1.CollectionItemsResponse.verify|verify} messages.
             * @param message CollectionItemsResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionItemsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionItemsResponse message, length delimited. Does not implicitly {@link role.v1.CollectionItemsResponse.verify|verify} messages.
             * @param message CollectionItemsResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionItemsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionItemsResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionItemsResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionItemsResponse;

            /**
             * Decodes a CollectionItemsResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionItemsResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionItemsResponse;

            /**
             * Verifies a CollectionItemsResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionItemsResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionItemsResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionItemsResponse;

            /**
             * Creates a plain object from a CollectionItemsResponse message. Also converts values to other types if specified.
             * @param message CollectionItemsResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionItemsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionItemsResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionItemsResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionEndpointItemResponse. */
        interface ICollectionEndpointItemResponse {

            /** CollectionEndpointItemResponse item */
            item?: (role.v1.ICollectionEndpointItem|null);
        }

        /** Represents a CollectionEndpointItemResponse. */
        class CollectionEndpointItemResponse implements ICollectionEndpointItemResponse {

            /**
             * Constructs a new CollectionEndpointItemResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionEndpointItemResponse);

            /** CollectionEndpointItemResponse item. */
            public item?: (role.v1.ICollectionEndpointItem|null);

            /**
             * Creates a new CollectionEndpointItemResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionEndpointItemResponse instance
             */
            public static create(properties?: role.v1.ICollectionEndpointItemResponse): role.v1.CollectionEndpointItemResponse;

            /**
             * Encodes the specified CollectionEndpointItemResponse message. Does not implicitly {@link role.v1.CollectionEndpointItemResponse.verify|verify} messages.
             * @param message CollectionEndpointItemResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionEndpointItemResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionEndpointItemResponse message, length delimited. Does not implicitly {@link role.v1.CollectionEndpointItemResponse.verify|verify} messages.
             * @param message CollectionEndpointItemResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionEndpointItemResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionEndpointItemResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionEndpointItemResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionEndpointItemResponse;

            /**
             * Decodes a CollectionEndpointItemResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionEndpointItemResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionEndpointItemResponse;

            /**
             * Verifies a CollectionEndpointItemResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionEndpointItemResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionEndpointItemResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionEndpointItemResponse;

            /**
             * Creates a plain object from a CollectionEndpointItemResponse message. Also converts values to other types if specified.
             * @param message CollectionEndpointItemResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionEndpointItemResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionEndpointItemResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionEndpointItemResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionEndpointItemsResponse. */
        interface ICollectionEndpointItemsResponse {

            /** CollectionEndpointItemsResponse items */
            items?: (role.v1.ICollectionEndpointItem[]|null);
        }

        /** Represents a CollectionEndpointItemsResponse. */
        class CollectionEndpointItemsResponse implements ICollectionEndpointItemsResponse {

            /**
             * Constructs a new CollectionEndpointItemsResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionEndpointItemsResponse);

            /** CollectionEndpointItemsResponse items. */
            public items: role.v1.ICollectionEndpointItem[];

            /**
             * Creates a new CollectionEndpointItemsResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionEndpointItemsResponse instance
             */
            public static create(properties?: role.v1.ICollectionEndpointItemsResponse): role.v1.CollectionEndpointItemsResponse;

            /**
             * Encodes the specified CollectionEndpointItemsResponse message. Does not implicitly {@link role.v1.CollectionEndpointItemsResponse.verify|verify} messages.
             * @param message CollectionEndpointItemsResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionEndpointItemsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionEndpointItemsResponse message, length delimited. Does not implicitly {@link role.v1.CollectionEndpointItemsResponse.verify|verify} messages.
             * @param message CollectionEndpointItemsResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionEndpointItemsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionEndpointItemsResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionEndpointItemsResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionEndpointItemsResponse;

            /**
             * Decodes a CollectionEndpointItemsResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionEndpointItemsResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionEndpointItemsResponse;

            /**
             * Verifies a CollectionEndpointItemsResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionEndpointItemsResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionEndpointItemsResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionEndpointItemsResponse;

            /**
             * Creates a plain object from a CollectionEndpointItemsResponse message. Also converts values to other types if specified.
             * @param message CollectionEndpointItemsResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionEndpointItemsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionEndpointItemsResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionEndpointItemsResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionFolderItemResponse. */
        interface ICollectionFolderItemResponse {

            /** CollectionFolderItemResponse item */
            item?: (role.v1.ICollectionFolderItem|null);
        }

        /** Represents a CollectionFolderItemResponse. */
        class CollectionFolderItemResponse implements ICollectionFolderItemResponse {

            /**
             * Constructs a new CollectionFolderItemResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionFolderItemResponse);

            /** CollectionFolderItemResponse item. */
            public item?: (role.v1.ICollectionFolderItem|null);

            /**
             * Creates a new CollectionFolderItemResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionFolderItemResponse instance
             */
            public static create(properties?: role.v1.ICollectionFolderItemResponse): role.v1.CollectionFolderItemResponse;

            /**
             * Encodes the specified CollectionFolderItemResponse message. Does not implicitly {@link role.v1.CollectionFolderItemResponse.verify|verify} messages.
             * @param message CollectionFolderItemResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionFolderItemResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionFolderItemResponse message, length delimited. Does not implicitly {@link role.v1.CollectionFolderItemResponse.verify|verify} messages.
             * @param message CollectionFolderItemResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionFolderItemResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionFolderItemResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionFolderItemResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionFolderItemResponse;

            /**
             * Decodes a CollectionFolderItemResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionFolderItemResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionFolderItemResponse;

            /**
             * Verifies a CollectionFolderItemResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionFolderItemResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionFolderItemResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionFolderItemResponse;

            /**
             * Creates a plain object from a CollectionFolderItemResponse message. Also converts values to other types if specified.
             * @param message CollectionFolderItemResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionFolderItemResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionFolderItemResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionFolderItemResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionFolderItemsResponse. */
        interface ICollectionFolderItemsResponse {

            /** CollectionFolderItemsResponse items */
            items?: (role.v1.ICollectionFolderItem[]|null);
        }

        /** Represents a CollectionFolderItemsResponse. */
        class CollectionFolderItemsResponse implements ICollectionFolderItemsResponse {

            /**
             * Constructs a new CollectionFolderItemsResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionFolderItemsResponse);

            /** CollectionFolderItemsResponse items. */
            public items: role.v1.ICollectionFolderItem[];

            /**
             * Creates a new CollectionFolderItemsResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionFolderItemsResponse instance
             */
            public static create(properties?: role.v1.ICollectionFolderItemsResponse): role.v1.CollectionFolderItemsResponse;

            /**
             * Encodes the specified CollectionFolderItemsResponse message. Does not implicitly {@link role.v1.CollectionFolderItemsResponse.verify|verify} messages.
             * @param message CollectionFolderItemsResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionFolderItemsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionFolderItemsResponse message, length delimited. Does not implicitly {@link role.v1.CollectionFolderItemsResponse.verify|verify} messages.
             * @param message CollectionFolderItemsResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionFolderItemsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionFolderItemsResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionFolderItemsResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionFolderItemsResponse;

            /**
             * Decodes a CollectionFolderItemsResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionFolderItemsResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionFolderItemsResponse;

            /**
             * Verifies a CollectionFolderItemsResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionFolderItemsResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionFolderItemsResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionFolderItemsResponse;

            /**
             * Creates a plain object from a CollectionFolderItemsResponse message. Also converts values to other types if specified.
             * @param message CollectionFolderItemsResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionFolderItemsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionFolderItemsResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionFolderItemsResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionExampleItemResponse. */
        interface ICollectionExampleItemResponse {

            /** CollectionExampleItemResponse item */
            item?: (role.v1.ICollectionExampleItem|null);
        }

        /** Represents a CollectionExampleItemResponse. */
        class CollectionExampleItemResponse implements ICollectionExampleItemResponse {

            /**
             * Constructs a new CollectionExampleItemResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionExampleItemResponse);

            /** CollectionExampleItemResponse item. */
            public item?: (role.v1.ICollectionExampleItem|null);

            /**
             * Creates a new CollectionExampleItemResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionExampleItemResponse instance
             */
            public static create(properties?: role.v1.ICollectionExampleItemResponse): role.v1.CollectionExampleItemResponse;

            /**
             * Encodes the specified CollectionExampleItemResponse message. Does not implicitly {@link role.v1.CollectionExampleItemResponse.verify|verify} messages.
             * @param message CollectionExampleItemResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionExampleItemResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionExampleItemResponse message, length delimited. Does not implicitly {@link role.v1.CollectionExampleItemResponse.verify|verify} messages.
             * @param message CollectionExampleItemResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionExampleItemResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionExampleItemResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionExampleItemResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionExampleItemResponse;

            /**
             * Decodes a CollectionExampleItemResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionExampleItemResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionExampleItemResponse;

            /**
             * Verifies a CollectionExampleItemResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionExampleItemResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionExampleItemResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionExampleItemResponse;

            /**
             * Creates a plain object from a CollectionExampleItemResponse message. Also converts values to other types if specified.
             * @param message CollectionExampleItemResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionExampleItemResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionExampleItemResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionExampleItemResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionExampleItemsResponse. */
        interface ICollectionExampleItemsResponse {

            /** CollectionExampleItemsResponse items */
            items?: (role.v1.ICollectionExampleItem[]|null);
        }

        /** Represents a CollectionExampleItemsResponse. */
        class CollectionExampleItemsResponse implements ICollectionExampleItemsResponse {

            /**
             * Constructs a new CollectionExampleItemsResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionExampleItemsResponse);

            /** CollectionExampleItemsResponse items. */
            public items: role.v1.ICollectionExampleItem[];

            /**
             * Creates a new CollectionExampleItemsResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionExampleItemsResponse instance
             */
            public static create(properties?: role.v1.ICollectionExampleItemsResponse): role.v1.CollectionExampleItemsResponse;

            /**
             * Encodes the specified CollectionExampleItemsResponse message. Does not implicitly {@link role.v1.CollectionExampleItemsResponse.verify|verify} messages.
             * @param message CollectionExampleItemsResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionExampleItemsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionExampleItemsResponse message, length delimited. Does not implicitly {@link role.v1.CollectionExampleItemsResponse.verify|verify} messages.
             * @param message CollectionExampleItemsResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionExampleItemsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionExampleItemsResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionExampleItemsResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionExampleItemsResponse;

            /**
             * Decodes a CollectionExampleItemsResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionExampleItemsResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionExampleItemsResponse;

            /**
             * Verifies a CollectionExampleItemsResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionExampleItemsResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionExampleItemsResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionExampleItemsResponse;

            /**
             * Creates a plain object from a CollectionExampleItemsResponse message. Also converts values to other types if specified.
             * @param message CollectionExampleItemsResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionExampleItemsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionExampleItemsResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionExampleItemsResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CollectionActionResponse. */
        interface ICollectionActionResponse {

            /** CollectionActionResponse status */
            status?: (string|null);
        }

        /** Represents a CollectionActionResponse. */
        class CollectionActionResponse implements ICollectionActionResponse {

            /**
             * Constructs a new CollectionActionResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICollectionActionResponse);

            /** CollectionActionResponse status. */
            public status: string;

            /**
             * Creates a new CollectionActionResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CollectionActionResponse instance
             */
            public static create(properties?: role.v1.ICollectionActionResponse): role.v1.CollectionActionResponse;

            /**
             * Encodes the specified CollectionActionResponse message. Does not implicitly {@link role.v1.CollectionActionResponse.verify|verify} messages.
             * @param message CollectionActionResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICollectionActionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CollectionActionResponse message, length delimited. Does not implicitly {@link role.v1.CollectionActionResponse.verify|verify} messages.
             * @param message CollectionActionResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICollectionActionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CollectionActionResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CollectionActionResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CollectionActionResponse;

            /**
             * Decodes a CollectionActionResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CollectionActionResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CollectionActionResponse;

            /**
             * Verifies a CollectionActionResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CollectionActionResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CollectionActionResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CollectionActionResponse;

            /**
             * Creates a plain object from a CollectionActionResponse message. Also converts values to other types if specified.
             * @param message CollectionActionResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CollectionActionResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CollectionActionResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CollectionActionResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Represents a CollectionsService */
        class CollectionsService extends $protobuf.rpc.Service {

            /**
             * Constructs a new CollectionsService service.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             */
            constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

            /**
             * Creates new CollectionsService service using the specified rpc implementation.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             * @returns RPC service. Useful where requests and/or responses are streamed.
             */
            public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): CollectionsService;

            /**
             * Calls List.
             * @param request CollectionsListRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and CollectionItemsResponse
             */
            public list(request: role.v1.ICollectionsListRequest, callback: role.v1.CollectionsService.ListCallback): void;

            /**
             * Calls List.
             * @param request CollectionsListRequest message or plain object
             * @returns Promise
             */
            public list(request: role.v1.ICollectionsListRequest): Promise<role.v1.CollectionItemsResponse>;

            /**
             * Calls GetById.
             * @param request CollectionByIdRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and CollectionItemResponse
             */
            public getById(request: role.v1.ICollectionByIdRequest, callback: role.v1.CollectionsService.GetByIdCallback): void;

            /**
             * Calls GetById.
             * @param request CollectionByIdRequest message or plain object
             * @returns Promise
             */
            public getById(request: role.v1.ICollectionByIdRequest): Promise<role.v1.CollectionItemResponse>;

            /**
             * Calls Create.
             * @param request CollectionCreateRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and CollectionItemResponse
             */
            public create(request: role.v1.ICollectionCreateRequest, callback: role.v1.CollectionsService.CreateCallback): void;

            /**
             * Calls Create.
             * @param request CollectionCreateRequest message or plain object
             * @returns Promise
             */
            public create(request: role.v1.ICollectionCreateRequest): Promise<role.v1.CollectionItemResponse>;

            /**
             * Calls Update.
             * @param request CollectionUpdateRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and CollectionItemResponse
             */
            public update(request: role.v1.ICollectionUpdateRequest, callback: role.v1.CollectionsService.UpdateCallback): void;

            /**
             * Calls Update.
             * @param request CollectionUpdateRequest message or plain object
             * @returns Promise
             */
            public update(request: role.v1.ICollectionUpdateRequest): Promise<role.v1.CollectionItemResponse>;

            /**
             * Calls Delete.
             * @param request CollectionDeleteRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and CollectionActionResponse
             */
            public delete(request: role.v1.ICollectionDeleteRequest, callback: role.v1.CollectionsService.DeleteCallback): void;

            /**
             * Calls Delete.
             * @param request CollectionDeleteRequest message or plain object
             * @returns Promise
             */
            public delete(request: role.v1.ICollectionDeleteRequest): Promise<role.v1.CollectionActionResponse>;

            /**
             * Calls ListEndpoints.
             * @param request CollectionByIdRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and CollectionEndpointItemsResponse
             */
            public listEndpoints(request: role.v1.ICollectionByIdRequest, callback: role.v1.CollectionsService.ListEndpointsCallback): void;

            /**
             * Calls ListEndpoints.
             * @param request CollectionByIdRequest message or plain object
             * @returns Promise
             */
            public listEndpoints(request: role.v1.ICollectionByIdRequest): Promise<role.v1.CollectionEndpointItemsResponse>;

            /**
             * Calls GetEndpointById.
             * @param request CollectionEndpointByIdRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and CollectionEndpointItemResponse
             */
            public getEndpointById(request: role.v1.ICollectionEndpointByIdRequest, callback: role.v1.CollectionsService.GetEndpointByIdCallback): void;

            /**
             * Calls GetEndpointById.
             * @param request CollectionEndpointByIdRequest message or plain object
             * @returns Promise
             */
            public getEndpointById(request: role.v1.ICollectionEndpointByIdRequest): Promise<role.v1.CollectionEndpointItemResponse>;

            /**
             * Calls CreateEndpoint.
             * @param request CollectionEndpointCreateRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and CollectionEndpointItemResponse
             */
            public createEndpoint(request: role.v1.ICollectionEndpointCreateRequest, callback: role.v1.CollectionsService.CreateEndpointCallback): void;

            /**
             * Calls CreateEndpoint.
             * @param request CollectionEndpointCreateRequest message or plain object
             * @returns Promise
             */
            public createEndpoint(request: role.v1.ICollectionEndpointCreateRequest): Promise<role.v1.CollectionEndpointItemResponse>;

            /**
             * Calls UpdateEndpoint.
             * @param request CollectionEndpointUpdateRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and CollectionEndpointItemResponse
             */
            public updateEndpoint(request: role.v1.ICollectionEndpointUpdateRequest, callback: role.v1.CollectionsService.UpdateEndpointCallback): void;

            /**
             * Calls UpdateEndpoint.
             * @param request CollectionEndpointUpdateRequest message or plain object
             * @returns Promise
             */
            public updateEndpoint(request: role.v1.ICollectionEndpointUpdateRequest): Promise<role.v1.CollectionEndpointItemResponse>;

            /**
             * Calls DeleteEndpoint.
             * @param request CollectionEndpointByIdRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and CollectionActionResponse
             */
            public deleteEndpoint(request: role.v1.ICollectionEndpointByIdRequest, callback: role.v1.CollectionsService.DeleteEndpointCallback): void;

            /**
             * Calls DeleteEndpoint.
             * @param request CollectionEndpointByIdRequest message or plain object
             * @returns Promise
             */
            public deleteEndpoint(request: role.v1.ICollectionEndpointByIdRequest): Promise<role.v1.CollectionActionResponse>;

            /**
             * Calls ListFolders.
             * @param request CollectionByIdRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and CollectionFolderItemsResponse
             */
            public listFolders(request: role.v1.ICollectionByIdRequest, callback: role.v1.CollectionsService.ListFoldersCallback): void;

            /**
             * Calls ListFolders.
             * @param request CollectionByIdRequest message or plain object
             * @returns Promise
             */
            public listFolders(request: role.v1.ICollectionByIdRequest): Promise<role.v1.CollectionFolderItemsResponse>;

            /**
             * Calls CreateFolder.
             * @param request CollectionFolderCreateRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and CollectionFolderItemResponse
             */
            public createFolder(request: role.v1.ICollectionFolderCreateRequest, callback: role.v1.CollectionsService.CreateFolderCallback): void;

            /**
             * Calls CreateFolder.
             * @param request CollectionFolderCreateRequest message or plain object
             * @returns Promise
             */
            public createFolder(request: role.v1.ICollectionFolderCreateRequest): Promise<role.v1.CollectionFolderItemResponse>;

            /**
             * Calls UpdateFolder.
             * @param request CollectionFolderUpdateRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and CollectionFolderItemResponse
             */
            public updateFolder(request: role.v1.ICollectionFolderUpdateRequest, callback: role.v1.CollectionsService.UpdateFolderCallback): void;

            /**
             * Calls UpdateFolder.
             * @param request CollectionFolderUpdateRequest message or plain object
             * @returns Promise
             */
            public updateFolder(request: role.v1.ICollectionFolderUpdateRequest): Promise<role.v1.CollectionFolderItemResponse>;

            /**
             * Calls DeleteFolder.
             * @param request CollectionFolderByIdRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and CollectionActionResponse
             */
            public deleteFolder(request: role.v1.ICollectionFolderByIdRequest, callback: role.v1.CollectionsService.DeleteFolderCallback): void;

            /**
             * Calls DeleteFolder.
             * @param request CollectionFolderByIdRequest message or plain object
             * @returns Promise
             */
            public deleteFolder(request: role.v1.ICollectionFolderByIdRequest): Promise<role.v1.CollectionActionResponse>;

            /**
             * Calls ListEndpointExamples.
             * @param request CollectionEndpointByIdRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and CollectionExampleItemsResponse
             */
            public listEndpointExamples(request: role.v1.ICollectionEndpointByIdRequest, callback: role.v1.CollectionsService.ListEndpointExamplesCallback): void;

            /**
             * Calls ListEndpointExamples.
             * @param request CollectionEndpointByIdRequest message or plain object
             * @returns Promise
             */
            public listEndpointExamples(request: role.v1.ICollectionEndpointByIdRequest): Promise<role.v1.CollectionExampleItemsResponse>;

            /**
             * Calls CreateEndpointExample.
             * @param request CollectionExampleCreateRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and CollectionExampleItemResponse
             */
            public createEndpointExample(request: role.v1.ICollectionExampleCreateRequest, callback: role.v1.CollectionsService.CreateEndpointExampleCallback): void;

            /**
             * Calls CreateEndpointExample.
             * @param request CollectionExampleCreateRequest message or plain object
             * @returns Promise
             */
            public createEndpointExample(request: role.v1.ICollectionExampleCreateRequest): Promise<role.v1.CollectionExampleItemResponse>;

            /**
             * Calls UpdateEndpointExample.
             * @param request CollectionExampleUpdateRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and CollectionExampleItemResponse
             */
            public updateEndpointExample(request: role.v1.ICollectionExampleUpdateRequest, callback: role.v1.CollectionsService.UpdateEndpointExampleCallback): void;

            /**
             * Calls UpdateEndpointExample.
             * @param request CollectionExampleUpdateRequest message or plain object
             * @returns Promise
             */
            public updateEndpointExample(request: role.v1.ICollectionExampleUpdateRequest): Promise<role.v1.CollectionExampleItemResponse>;

            /**
             * Calls DeleteEndpointExample.
             * @param request CollectionExampleByIdRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and CollectionActionResponse
             */
            public deleteEndpointExample(request: role.v1.ICollectionExampleByIdRequest, callback: role.v1.CollectionsService.DeleteEndpointExampleCallback): void;

            /**
             * Calls DeleteEndpointExample.
             * @param request CollectionExampleByIdRequest message or plain object
             * @returns Promise
             */
            public deleteEndpointExample(request: role.v1.ICollectionExampleByIdRequest): Promise<role.v1.CollectionActionResponse>;
        }

        namespace CollectionsService {

            /**
             * Callback as used by {@link role.v1.CollectionsService#list}.
             * @param error Error, if any
             * @param [response] CollectionItemsResponse
             */
            type ListCallback = (error: (Error|null), response?: role.v1.CollectionItemsResponse) => void;

            /**
             * Callback as used by {@link role.v1.CollectionsService#getById}.
             * @param error Error, if any
             * @param [response] CollectionItemResponse
             */
            type GetByIdCallback = (error: (Error|null), response?: role.v1.CollectionItemResponse) => void;

            /**
             * Callback as used by {@link role.v1.CollectionsService#create}.
             * @param error Error, if any
             * @param [response] CollectionItemResponse
             */
            type CreateCallback = (error: (Error|null), response?: role.v1.CollectionItemResponse) => void;

            /**
             * Callback as used by {@link role.v1.CollectionsService#update}.
             * @param error Error, if any
             * @param [response] CollectionItemResponse
             */
            type UpdateCallback = (error: (Error|null), response?: role.v1.CollectionItemResponse) => void;

            /**
             * Callback as used by {@link role.v1.CollectionsService#delete_}.
             * @param error Error, if any
             * @param [response] CollectionActionResponse
             */
            type DeleteCallback = (error: (Error|null), response?: role.v1.CollectionActionResponse) => void;

            /**
             * Callback as used by {@link role.v1.CollectionsService#listEndpoints}.
             * @param error Error, if any
             * @param [response] CollectionEndpointItemsResponse
             */
            type ListEndpointsCallback = (error: (Error|null), response?: role.v1.CollectionEndpointItemsResponse) => void;

            /**
             * Callback as used by {@link role.v1.CollectionsService#getEndpointById}.
             * @param error Error, if any
             * @param [response] CollectionEndpointItemResponse
             */
            type GetEndpointByIdCallback = (error: (Error|null), response?: role.v1.CollectionEndpointItemResponse) => void;

            /**
             * Callback as used by {@link role.v1.CollectionsService#createEndpoint}.
             * @param error Error, if any
             * @param [response] CollectionEndpointItemResponse
             */
            type CreateEndpointCallback = (error: (Error|null), response?: role.v1.CollectionEndpointItemResponse) => void;

            /**
             * Callback as used by {@link role.v1.CollectionsService#updateEndpoint}.
             * @param error Error, if any
             * @param [response] CollectionEndpointItemResponse
             */
            type UpdateEndpointCallback = (error: (Error|null), response?: role.v1.CollectionEndpointItemResponse) => void;

            /**
             * Callback as used by {@link role.v1.CollectionsService#deleteEndpoint}.
             * @param error Error, if any
             * @param [response] CollectionActionResponse
             */
            type DeleteEndpointCallback = (error: (Error|null), response?: role.v1.CollectionActionResponse) => void;

            /**
             * Callback as used by {@link role.v1.CollectionsService#listFolders}.
             * @param error Error, if any
             * @param [response] CollectionFolderItemsResponse
             */
            type ListFoldersCallback = (error: (Error|null), response?: role.v1.CollectionFolderItemsResponse) => void;

            /**
             * Callback as used by {@link role.v1.CollectionsService#createFolder}.
             * @param error Error, if any
             * @param [response] CollectionFolderItemResponse
             */
            type CreateFolderCallback = (error: (Error|null), response?: role.v1.CollectionFolderItemResponse) => void;

            /**
             * Callback as used by {@link role.v1.CollectionsService#updateFolder}.
             * @param error Error, if any
             * @param [response] CollectionFolderItemResponse
             */
            type UpdateFolderCallback = (error: (Error|null), response?: role.v1.CollectionFolderItemResponse) => void;

            /**
             * Callback as used by {@link role.v1.CollectionsService#deleteFolder}.
             * @param error Error, if any
             * @param [response] CollectionActionResponse
             */
            type DeleteFolderCallback = (error: (Error|null), response?: role.v1.CollectionActionResponse) => void;

            /**
             * Callback as used by {@link role.v1.CollectionsService#listEndpointExamples}.
             * @param error Error, if any
             * @param [response] CollectionExampleItemsResponse
             */
            type ListEndpointExamplesCallback = (error: (Error|null), response?: role.v1.CollectionExampleItemsResponse) => void;

            /**
             * Callback as used by {@link role.v1.CollectionsService#createEndpointExample}.
             * @param error Error, if any
             * @param [response] CollectionExampleItemResponse
             */
            type CreateEndpointExampleCallback = (error: (Error|null), response?: role.v1.CollectionExampleItemResponse) => void;

            /**
             * Callback as used by {@link role.v1.CollectionsService#updateEndpointExample}.
             * @param error Error, if any
             * @param [response] CollectionExampleItemResponse
             */
            type UpdateEndpointExampleCallback = (error: (Error|null), response?: role.v1.CollectionExampleItemResponse) => void;

            /**
             * Callback as used by {@link role.v1.CollectionsService#deleteEndpointExample}.
             * @param error Error, if any
             * @param [response] CollectionActionResponse
             */
            type DeleteEndpointExampleCallback = (error: (Error|null), response?: role.v1.CollectionActionResponse) => void;
        }

        /** Properties of an EnvironmentItem. */
        interface IEnvironmentItem {

            /** EnvironmentItem id */
            id?: (number|Long|null);

            /** EnvironmentItem workspaceId */
            workspaceId?: (number|Long|null);

            /** EnvironmentItem name */
            name?: (string|null);

            /** EnvironmentItem createdByUserId */
            createdByUserId?: (number|Long|null);

            /** EnvironmentItem createdAt */
            createdAt?: (string|null);

            /** EnvironmentItem updatedAt */
            updatedAt?: (string|null);
        }

        /** Represents an EnvironmentItem. */
        class EnvironmentItem implements IEnvironmentItem {

            /**
             * Constructs a new EnvironmentItem.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IEnvironmentItem);

            /** EnvironmentItem id. */
            public id: (number|Long);

            /** EnvironmentItem workspaceId. */
            public workspaceId: (number|Long);

            /** EnvironmentItem name. */
            public name: string;

            /** EnvironmentItem createdByUserId. */
            public createdByUserId: (number|Long);

            /** EnvironmentItem createdAt. */
            public createdAt: string;

            /** EnvironmentItem updatedAt. */
            public updatedAt: string;

            /**
             * Creates a new EnvironmentItem instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnvironmentItem instance
             */
            public static create(properties?: role.v1.IEnvironmentItem): role.v1.EnvironmentItem;

            /**
             * Encodes the specified EnvironmentItem message. Does not implicitly {@link role.v1.EnvironmentItem.verify|verify} messages.
             * @param message EnvironmentItem message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IEnvironmentItem, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnvironmentItem message, length delimited. Does not implicitly {@link role.v1.EnvironmentItem.verify|verify} messages.
             * @param message EnvironmentItem message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IEnvironmentItem, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnvironmentItem message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnvironmentItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.EnvironmentItem;

            /**
             * Decodes an EnvironmentItem message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnvironmentItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.EnvironmentItem;

            /**
             * Verifies an EnvironmentItem message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnvironmentItem message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnvironmentItem
             */
            public static fromObject(object: { [k: string]: any }): role.v1.EnvironmentItem;

            /**
             * Creates a plain object from an EnvironmentItem message. Also converts values to other types if specified.
             * @param message EnvironmentItem
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.EnvironmentItem, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnvironmentItem to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for EnvironmentItem
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an EnvironmentVariableItem. */
        interface IEnvironmentVariableItem {

            /** EnvironmentVariableItem id */
            id?: (number|Long|null);

            /** EnvironmentVariableItem environmentId */
            environmentId?: (number|Long|null);

            /** EnvironmentVariableItem key */
            key?: (string|null);

            /** EnvironmentVariableItem value */
            value?: (string|null);

            /** EnvironmentVariableItem enabled */
            enabled?: (boolean|null);

            /** EnvironmentVariableItem isSecret */
            isSecret?: (boolean|null);

            /** EnvironmentVariableItem position */
            position?: (number|null);

            /** EnvironmentVariableItem createdByUserId */
            createdByUserId?: (number|Long|null);

            /** EnvironmentVariableItem createdAt */
            createdAt?: (string|null);

            /** EnvironmentVariableItem updatedAt */
            updatedAt?: (string|null);
        }

        /** Represents an EnvironmentVariableItem. */
        class EnvironmentVariableItem implements IEnvironmentVariableItem {

            /**
             * Constructs a new EnvironmentVariableItem.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IEnvironmentVariableItem);

            /** EnvironmentVariableItem id. */
            public id: (number|Long);

            /** EnvironmentVariableItem environmentId. */
            public environmentId: (number|Long);

            /** EnvironmentVariableItem key. */
            public key: string;

            /** EnvironmentVariableItem value. */
            public value: string;

            /** EnvironmentVariableItem enabled. */
            public enabled: boolean;

            /** EnvironmentVariableItem isSecret. */
            public isSecret: boolean;

            /** EnvironmentVariableItem position. */
            public position: number;

            /** EnvironmentVariableItem createdByUserId. */
            public createdByUserId: (number|Long);

            /** EnvironmentVariableItem createdAt. */
            public createdAt: string;

            /** EnvironmentVariableItem updatedAt. */
            public updatedAt: string;

            /**
             * Creates a new EnvironmentVariableItem instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnvironmentVariableItem instance
             */
            public static create(properties?: role.v1.IEnvironmentVariableItem): role.v1.EnvironmentVariableItem;

            /**
             * Encodes the specified EnvironmentVariableItem message. Does not implicitly {@link role.v1.EnvironmentVariableItem.verify|verify} messages.
             * @param message EnvironmentVariableItem message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IEnvironmentVariableItem, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnvironmentVariableItem message, length delimited. Does not implicitly {@link role.v1.EnvironmentVariableItem.verify|verify} messages.
             * @param message EnvironmentVariableItem message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IEnvironmentVariableItem, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnvironmentVariableItem message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnvironmentVariableItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.EnvironmentVariableItem;

            /**
             * Decodes an EnvironmentVariableItem message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnvironmentVariableItem
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.EnvironmentVariableItem;

            /**
             * Verifies an EnvironmentVariableItem message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnvironmentVariableItem message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnvironmentVariableItem
             */
            public static fromObject(object: { [k: string]: any }): role.v1.EnvironmentVariableItem;

            /**
             * Creates a plain object from an EnvironmentVariableItem message. Also converts values to other types if specified.
             * @param message EnvironmentVariableItem
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.EnvironmentVariableItem, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnvironmentVariableItem to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for EnvironmentVariableItem
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an EnvironmentListRequest. */
        interface IEnvironmentListRequest {

            /** EnvironmentListRequest workspaceId */
            workspaceId?: (number|Long|null);
        }

        /** Represents an EnvironmentListRequest. */
        class EnvironmentListRequest implements IEnvironmentListRequest {

            /**
             * Constructs a new EnvironmentListRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IEnvironmentListRequest);

            /** EnvironmentListRequest workspaceId. */
            public workspaceId: (number|Long);

            /**
             * Creates a new EnvironmentListRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnvironmentListRequest instance
             */
            public static create(properties?: role.v1.IEnvironmentListRequest): role.v1.EnvironmentListRequest;

            /**
             * Encodes the specified EnvironmentListRequest message. Does not implicitly {@link role.v1.EnvironmentListRequest.verify|verify} messages.
             * @param message EnvironmentListRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IEnvironmentListRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnvironmentListRequest message, length delimited. Does not implicitly {@link role.v1.EnvironmentListRequest.verify|verify} messages.
             * @param message EnvironmentListRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IEnvironmentListRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnvironmentListRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnvironmentListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.EnvironmentListRequest;

            /**
             * Decodes an EnvironmentListRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnvironmentListRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.EnvironmentListRequest;

            /**
             * Verifies an EnvironmentListRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnvironmentListRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnvironmentListRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.EnvironmentListRequest;

            /**
             * Creates a plain object from an EnvironmentListRequest message. Also converts values to other types if specified.
             * @param message EnvironmentListRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.EnvironmentListRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnvironmentListRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for EnvironmentListRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an EnvironmentByIdRequest. */
        interface IEnvironmentByIdRequest {

            /** EnvironmentByIdRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** EnvironmentByIdRequest environmentId */
            environmentId?: (number|Long|null);
        }

        /** Represents an EnvironmentByIdRequest. */
        class EnvironmentByIdRequest implements IEnvironmentByIdRequest {

            /**
             * Constructs a new EnvironmentByIdRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IEnvironmentByIdRequest);

            /** EnvironmentByIdRequest workspaceId. */
            public workspaceId: (number|Long);

            /** EnvironmentByIdRequest environmentId. */
            public environmentId: (number|Long);

            /**
             * Creates a new EnvironmentByIdRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnvironmentByIdRequest instance
             */
            public static create(properties?: role.v1.IEnvironmentByIdRequest): role.v1.EnvironmentByIdRequest;

            /**
             * Encodes the specified EnvironmentByIdRequest message. Does not implicitly {@link role.v1.EnvironmentByIdRequest.verify|verify} messages.
             * @param message EnvironmentByIdRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IEnvironmentByIdRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnvironmentByIdRequest message, length delimited. Does not implicitly {@link role.v1.EnvironmentByIdRequest.verify|verify} messages.
             * @param message EnvironmentByIdRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IEnvironmentByIdRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnvironmentByIdRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnvironmentByIdRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.EnvironmentByIdRequest;

            /**
             * Decodes an EnvironmentByIdRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnvironmentByIdRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.EnvironmentByIdRequest;

            /**
             * Verifies an EnvironmentByIdRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnvironmentByIdRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnvironmentByIdRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.EnvironmentByIdRequest;

            /**
             * Creates a plain object from an EnvironmentByIdRequest message. Also converts values to other types if specified.
             * @param message EnvironmentByIdRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.EnvironmentByIdRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnvironmentByIdRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for EnvironmentByIdRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an EnvironmentVariableByIdRequest. */
        interface IEnvironmentVariableByIdRequest {

            /** EnvironmentVariableByIdRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** EnvironmentVariableByIdRequest environmentId */
            environmentId?: (number|Long|null);

            /** EnvironmentVariableByIdRequest variableId */
            variableId?: (number|Long|null);
        }

        /** Represents an EnvironmentVariableByIdRequest. */
        class EnvironmentVariableByIdRequest implements IEnvironmentVariableByIdRequest {

            /**
             * Constructs a new EnvironmentVariableByIdRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IEnvironmentVariableByIdRequest);

            /** EnvironmentVariableByIdRequest workspaceId. */
            public workspaceId: (number|Long);

            /** EnvironmentVariableByIdRequest environmentId. */
            public environmentId: (number|Long);

            /** EnvironmentVariableByIdRequest variableId. */
            public variableId: (number|Long);

            /**
             * Creates a new EnvironmentVariableByIdRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnvironmentVariableByIdRequest instance
             */
            public static create(properties?: role.v1.IEnvironmentVariableByIdRequest): role.v1.EnvironmentVariableByIdRequest;

            /**
             * Encodes the specified EnvironmentVariableByIdRequest message. Does not implicitly {@link role.v1.EnvironmentVariableByIdRequest.verify|verify} messages.
             * @param message EnvironmentVariableByIdRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IEnvironmentVariableByIdRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnvironmentVariableByIdRequest message, length delimited. Does not implicitly {@link role.v1.EnvironmentVariableByIdRequest.verify|verify} messages.
             * @param message EnvironmentVariableByIdRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IEnvironmentVariableByIdRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnvironmentVariableByIdRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnvironmentVariableByIdRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.EnvironmentVariableByIdRequest;

            /**
             * Decodes an EnvironmentVariableByIdRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnvironmentVariableByIdRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.EnvironmentVariableByIdRequest;

            /**
             * Verifies an EnvironmentVariableByIdRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnvironmentVariableByIdRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnvironmentVariableByIdRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.EnvironmentVariableByIdRequest;

            /**
             * Creates a plain object from an EnvironmentVariableByIdRequest message. Also converts values to other types if specified.
             * @param message EnvironmentVariableByIdRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.EnvironmentVariableByIdRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnvironmentVariableByIdRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for EnvironmentVariableByIdRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an EnvironmentCreateRequest. */
        interface IEnvironmentCreateRequest {

            /** EnvironmentCreateRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** EnvironmentCreateRequest name */
            name?: (string|null);
        }

        /** Represents an EnvironmentCreateRequest. */
        class EnvironmentCreateRequest implements IEnvironmentCreateRequest {

            /**
             * Constructs a new EnvironmentCreateRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IEnvironmentCreateRequest);

            /** EnvironmentCreateRequest workspaceId. */
            public workspaceId: (number|Long);

            /** EnvironmentCreateRequest name. */
            public name: string;

            /**
             * Creates a new EnvironmentCreateRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnvironmentCreateRequest instance
             */
            public static create(properties?: role.v1.IEnvironmentCreateRequest): role.v1.EnvironmentCreateRequest;

            /**
             * Encodes the specified EnvironmentCreateRequest message. Does not implicitly {@link role.v1.EnvironmentCreateRequest.verify|verify} messages.
             * @param message EnvironmentCreateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IEnvironmentCreateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnvironmentCreateRequest message, length delimited. Does not implicitly {@link role.v1.EnvironmentCreateRequest.verify|verify} messages.
             * @param message EnvironmentCreateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IEnvironmentCreateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnvironmentCreateRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnvironmentCreateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.EnvironmentCreateRequest;

            /**
             * Decodes an EnvironmentCreateRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnvironmentCreateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.EnvironmentCreateRequest;

            /**
             * Verifies an EnvironmentCreateRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnvironmentCreateRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnvironmentCreateRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.EnvironmentCreateRequest;

            /**
             * Creates a plain object from an EnvironmentCreateRequest message. Also converts values to other types if specified.
             * @param message EnvironmentCreateRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.EnvironmentCreateRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnvironmentCreateRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for EnvironmentCreateRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an EnvironmentUpdateRequest. */
        interface IEnvironmentUpdateRequest {

            /** EnvironmentUpdateRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** EnvironmentUpdateRequest environmentId */
            environmentId?: (number|Long|null);

            /** EnvironmentUpdateRequest name */
            name?: (string|null);
        }

        /** Represents an EnvironmentUpdateRequest. */
        class EnvironmentUpdateRequest implements IEnvironmentUpdateRequest {

            /**
             * Constructs a new EnvironmentUpdateRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IEnvironmentUpdateRequest);

            /** EnvironmentUpdateRequest workspaceId. */
            public workspaceId: (number|Long);

            /** EnvironmentUpdateRequest environmentId. */
            public environmentId: (number|Long);

            /** EnvironmentUpdateRequest name. */
            public name?: (string|null);

            /**
             * Creates a new EnvironmentUpdateRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnvironmentUpdateRequest instance
             */
            public static create(properties?: role.v1.IEnvironmentUpdateRequest): role.v1.EnvironmentUpdateRequest;

            /**
             * Encodes the specified EnvironmentUpdateRequest message. Does not implicitly {@link role.v1.EnvironmentUpdateRequest.verify|verify} messages.
             * @param message EnvironmentUpdateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IEnvironmentUpdateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnvironmentUpdateRequest message, length delimited. Does not implicitly {@link role.v1.EnvironmentUpdateRequest.verify|verify} messages.
             * @param message EnvironmentUpdateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IEnvironmentUpdateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnvironmentUpdateRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnvironmentUpdateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.EnvironmentUpdateRequest;

            /**
             * Decodes an EnvironmentUpdateRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnvironmentUpdateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.EnvironmentUpdateRequest;

            /**
             * Verifies an EnvironmentUpdateRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnvironmentUpdateRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnvironmentUpdateRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.EnvironmentUpdateRequest;

            /**
             * Creates a plain object from an EnvironmentUpdateRequest message. Also converts values to other types if specified.
             * @param message EnvironmentUpdateRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.EnvironmentUpdateRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnvironmentUpdateRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for EnvironmentUpdateRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an EnvironmentVariableCreateRequest. */
        interface IEnvironmentVariableCreateRequest {

            /** EnvironmentVariableCreateRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** EnvironmentVariableCreateRequest environmentId */
            environmentId?: (number|Long|null);

            /** EnvironmentVariableCreateRequest key */
            key?: (string|null);

            /** EnvironmentVariableCreateRequest value */
            value?: (string|null);

            /** EnvironmentVariableCreateRequest enabled */
            enabled?: (boolean|null);

            /** EnvironmentVariableCreateRequest isSecret */
            isSecret?: (boolean|null);

            /** EnvironmentVariableCreateRequest position */
            position?: (number|null);
        }

        /** Represents an EnvironmentVariableCreateRequest. */
        class EnvironmentVariableCreateRequest implements IEnvironmentVariableCreateRequest {

            /**
             * Constructs a new EnvironmentVariableCreateRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IEnvironmentVariableCreateRequest);

            /** EnvironmentVariableCreateRequest workspaceId. */
            public workspaceId: (number|Long);

            /** EnvironmentVariableCreateRequest environmentId. */
            public environmentId: (number|Long);

            /** EnvironmentVariableCreateRequest key. */
            public key: string;

            /** EnvironmentVariableCreateRequest value. */
            public value: string;

            /** EnvironmentVariableCreateRequest enabled. */
            public enabled: boolean;

            /** EnvironmentVariableCreateRequest isSecret. */
            public isSecret: boolean;

            /** EnvironmentVariableCreateRequest position. */
            public position: number;

            /**
             * Creates a new EnvironmentVariableCreateRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnvironmentVariableCreateRequest instance
             */
            public static create(properties?: role.v1.IEnvironmentVariableCreateRequest): role.v1.EnvironmentVariableCreateRequest;

            /**
             * Encodes the specified EnvironmentVariableCreateRequest message. Does not implicitly {@link role.v1.EnvironmentVariableCreateRequest.verify|verify} messages.
             * @param message EnvironmentVariableCreateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IEnvironmentVariableCreateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnvironmentVariableCreateRequest message, length delimited. Does not implicitly {@link role.v1.EnvironmentVariableCreateRequest.verify|verify} messages.
             * @param message EnvironmentVariableCreateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IEnvironmentVariableCreateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnvironmentVariableCreateRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnvironmentVariableCreateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.EnvironmentVariableCreateRequest;

            /**
             * Decodes an EnvironmentVariableCreateRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnvironmentVariableCreateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.EnvironmentVariableCreateRequest;

            /**
             * Verifies an EnvironmentVariableCreateRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnvironmentVariableCreateRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnvironmentVariableCreateRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.EnvironmentVariableCreateRequest;

            /**
             * Creates a plain object from an EnvironmentVariableCreateRequest message. Also converts values to other types if specified.
             * @param message EnvironmentVariableCreateRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.EnvironmentVariableCreateRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnvironmentVariableCreateRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for EnvironmentVariableCreateRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an EnvironmentVariableUpdateRequest. */
        interface IEnvironmentVariableUpdateRequest {

            /** EnvironmentVariableUpdateRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** EnvironmentVariableUpdateRequest environmentId */
            environmentId?: (number|Long|null);

            /** EnvironmentVariableUpdateRequest variableId */
            variableId?: (number|Long|null);

            /** EnvironmentVariableUpdateRequest key */
            key?: (string|null);

            /** EnvironmentVariableUpdateRequest value */
            value?: (string|null);

            /** EnvironmentVariableUpdateRequest enabled */
            enabled?: (boolean|null);

            /** EnvironmentVariableUpdateRequest isSecret */
            isSecret?: (boolean|null);

            /** EnvironmentVariableUpdateRequest position */
            position?: (number|null);
        }

        /** Represents an EnvironmentVariableUpdateRequest. */
        class EnvironmentVariableUpdateRequest implements IEnvironmentVariableUpdateRequest {

            /**
             * Constructs a new EnvironmentVariableUpdateRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IEnvironmentVariableUpdateRequest);

            /** EnvironmentVariableUpdateRequest workspaceId. */
            public workspaceId: (number|Long);

            /** EnvironmentVariableUpdateRequest environmentId. */
            public environmentId: (number|Long);

            /** EnvironmentVariableUpdateRequest variableId. */
            public variableId: (number|Long);

            /** EnvironmentVariableUpdateRequest key. */
            public key?: (string|null);

            /** EnvironmentVariableUpdateRequest value. */
            public value?: (string|null);

            /** EnvironmentVariableUpdateRequest enabled. */
            public enabled?: (boolean|null);

            /** EnvironmentVariableUpdateRequest isSecret. */
            public isSecret?: (boolean|null);

            /** EnvironmentVariableUpdateRequest position. */
            public position?: (number|null);

            /**
             * Creates a new EnvironmentVariableUpdateRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnvironmentVariableUpdateRequest instance
             */
            public static create(properties?: role.v1.IEnvironmentVariableUpdateRequest): role.v1.EnvironmentVariableUpdateRequest;

            /**
             * Encodes the specified EnvironmentVariableUpdateRequest message. Does not implicitly {@link role.v1.EnvironmentVariableUpdateRequest.verify|verify} messages.
             * @param message EnvironmentVariableUpdateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IEnvironmentVariableUpdateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnvironmentVariableUpdateRequest message, length delimited. Does not implicitly {@link role.v1.EnvironmentVariableUpdateRequest.verify|verify} messages.
             * @param message EnvironmentVariableUpdateRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IEnvironmentVariableUpdateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnvironmentVariableUpdateRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnvironmentVariableUpdateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.EnvironmentVariableUpdateRequest;

            /**
             * Decodes an EnvironmentVariableUpdateRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnvironmentVariableUpdateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.EnvironmentVariableUpdateRequest;

            /**
             * Verifies an EnvironmentVariableUpdateRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnvironmentVariableUpdateRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnvironmentVariableUpdateRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.EnvironmentVariableUpdateRequest;

            /**
             * Creates a plain object from an EnvironmentVariableUpdateRequest message. Also converts values to other types if specified.
             * @param message EnvironmentVariableUpdateRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.EnvironmentVariableUpdateRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnvironmentVariableUpdateRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for EnvironmentVariableUpdateRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an EnvironmentItemsResponse. */
        interface IEnvironmentItemsResponse {

            /** EnvironmentItemsResponse items */
            items?: (role.v1.IEnvironmentItem[]|null);
        }

        /** Represents an EnvironmentItemsResponse. */
        class EnvironmentItemsResponse implements IEnvironmentItemsResponse {

            /**
             * Constructs a new EnvironmentItemsResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IEnvironmentItemsResponse);

            /** EnvironmentItemsResponse items. */
            public items: role.v1.IEnvironmentItem[];

            /**
             * Creates a new EnvironmentItemsResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnvironmentItemsResponse instance
             */
            public static create(properties?: role.v1.IEnvironmentItemsResponse): role.v1.EnvironmentItemsResponse;

            /**
             * Encodes the specified EnvironmentItemsResponse message. Does not implicitly {@link role.v1.EnvironmentItemsResponse.verify|verify} messages.
             * @param message EnvironmentItemsResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IEnvironmentItemsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnvironmentItemsResponse message, length delimited. Does not implicitly {@link role.v1.EnvironmentItemsResponse.verify|verify} messages.
             * @param message EnvironmentItemsResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IEnvironmentItemsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnvironmentItemsResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnvironmentItemsResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.EnvironmentItemsResponse;

            /**
             * Decodes an EnvironmentItemsResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnvironmentItemsResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.EnvironmentItemsResponse;

            /**
             * Verifies an EnvironmentItemsResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnvironmentItemsResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnvironmentItemsResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.EnvironmentItemsResponse;

            /**
             * Creates a plain object from an EnvironmentItemsResponse message. Also converts values to other types if specified.
             * @param message EnvironmentItemsResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.EnvironmentItemsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnvironmentItemsResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for EnvironmentItemsResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an EnvironmentItemResponse. */
        interface IEnvironmentItemResponse {

            /** EnvironmentItemResponse item */
            item?: (role.v1.IEnvironmentItem|null);
        }

        /** Represents an EnvironmentItemResponse. */
        class EnvironmentItemResponse implements IEnvironmentItemResponse {

            /**
             * Constructs a new EnvironmentItemResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IEnvironmentItemResponse);

            /** EnvironmentItemResponse item. */
            public item?: (role.v1.IEnvironmentItem|null);

            /**
             * Creates a new EnvironmentItemResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnvironmentItemResponse instance
             */
            public static create(properties?: role.v1.IEnvironmentItemResponse): role.v1.EnvironmentItemResponse;

            /**
             * Encodes the specified EnvironmentItemResponse message. Does not implicitly {@link role.v1.EnvironmentItemResponse.verify|verify} messages.
             * @param message EnvironmentItemResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IEnvironmentItemResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnvironmentItemResponse message, length delimited. Does not implicitly {@link role.v1.EnvironmentItemResponse.verify|verify} messages.
             * @param message EnvironmentItemResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IEnvironmentItemResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnvironmentItemResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnvironmentItemResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.EnvironmentItemResponse;

            /**
             * Decodes an EnvironmentItemResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnvironmentItemResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.EnvironmentItemResponse;

            /**
             * Verifies an EnvironmentItemResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnvironmentItemResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnvironmentItemResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.EnvironmentItemResponse;

            /**
             * Creates a plain object from an EnvironmentItemResponse message. Also converts values to other types if specified.
             * @param message EnvironmentItemResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.EnvironmentItemResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnvironmentItemResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for EnvironmentItemResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an EnvironmentVariableItemsResponse. */
        interface IEnvironmentVariableItemsResponse {

            /** EnvironmentVariableItemsResponse items */
            items?: (role.v1.IEnvironmentVariableItem[]|null);
        }

        /** Represents an EnvironmentVariableItemsResponse. */
        class EnvironmentVariableItemsResponse implements IEnvironmentVariableItemsResponse {

            /**
             * Constructs a new EnvironmentVariableItemsResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IEnvironmentVariableItemsResponse);

            /** EnvironmentVariableItemsResponse items. */
            public items: role.v1.IEnvironmentVariableItem[];

            /**
             * Creates a new EnvironmentVariableItemsResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnvironmentVariableItemsResponse instance
             */
            public static create(properties?: role.v1.IEnvironmentVariableItemsResponse): role.v1.EnvironmentVariableItemsResponse;

            /**
             * Encodes the specified EnvironmentVariableItemsResponse message. Does not implicitly {@link role.v1.EnvironmentVariableItemsResponse.verify|verify} messages.
             * @param message EnvironmentVariableItemsResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IEnvironmentVariableItemsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnvironmentVariableItemsResponse message, length delimited. Does not implicitly {@link role.v1.EnvironmentVariableItemsResponse.verify|verify} messages.
             * @param message EnvironmentVariableItemsResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IEnvironmentVariableItemsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnvironmentVariableItemsResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnvironmentVariableItemsResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.EnvironmentVariableItemsResponse;

            /**
             * Decodes an EnvironmentVariableItemsResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnvironmentVariableItemsResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.EnvironmentVariableItemsResponse;

            /**
             * Verifies an EnvironmentVariableItemsResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnvironmentVariableItemsResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnvironmentVariableItemsResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.EnvironmentVariableItemsResponse;

            /**
             * Creates a plain object from an EnvironmentVariableItemsResponse message. Also converts values to other types if specified.
             * @param message EnvironmentVariableItemsResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.EnvironmentVariableItemsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnvironmentVariableItemsResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for EnvironmentVariableItemsResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an EnvironmentVariableItemResponse. */
        interface IEnvironmentVariableItemResponse {

            /** EnvironmentVariableItemResponse item */
            item?: (role.v1.IEnvironmentVariableItem|null);
        }

        /** Represents an EnvironmentVariableItemResponse. */
        class EnvironmentVariableItemResponse implements IEnvironmentVariableItemResponse {

            /**
             * Constructs a new EnvironmentVariableItemResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IEnvironmentVariableItemResponse);

            /** EnvironmentVariableItemResponse item. */
            public item?: (role.v1.IEnvironmentVariableItem|null);

            /**
             * Creates a new EnvironmentVariableItemResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnvironmentVariableItemResponse instance
             */
            public static create(properties?: role.v1.IEnvironmentVariableItemResponse): role.v1.EnvironmentVariableItemResponse;

            /**
             * Encodes the specified EnvironmentVariableItemResponse message. Does not implicitly {@link role.v1.EnvironmentVariableItemResponse.verify|verify} messages.
             * @param message EnvironmentVariableItemResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IEnvironmentVariableItemResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnvironmentVariableItemResponse message, length delimited. Does not implicitly {@link role.v1.EnvironmentVariableItemResponse.verify|verify} messages.
             * @param message EnvironmentVariableItemResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IEnvironmentVariableItemResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnvironmentVariableItemResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnvironmentVariableItemResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.EnvironmentVariableItemResponse;

            /**
             * Decodes an EnvironmentVariableItemResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnvironmentVariableItemResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.EnvironmentVariableItemResponse;

            /**
             * Verifies an EnvironmentVariableItemResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnvironmentVariableItemResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnvironmentVariableItemResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.EnvironmentVariableItemResponse;

            /**
             * Creates a plain object from an EnvironmentVariableItemResponse message. Also converts values to other types if specified.
             * @param message EnvironmentVariableItemResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.EnvironmentVariableItemResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnvironmentVariableItemResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for EnvironmentVariableItemResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an EnvironmentActionResponse. */
        interface IEnvironmentActionResponse {

            /** EnvironmentActionResponse status */
            status?: (string|null);
        }

        /** Represents an EnvironmentActionResponse. */
        class EnvironmentActionResponse implements IEnvironmentActionResponse {

            /**
             * Constructs a new EnvironmentActionResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IEnvironmentActionResponse);

            /** EnvironmentActionResponse status. */
            public status: string;

            /**
             * Creates a new EnvironmentActionResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnvironmentActionResponse instance
             */
            public static create(properties?: role.v1.IEnvironmentActionResponse): role.v1.EnvironmentActionResponse;

            /**
             * Encodes the specified EnvironmentActionResponse message. Does not implicitly {@link role.v1.EnvironmentActionResponse.verify|verify} messages.
             * @param message EnvironmentActionResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IEnvironmentActionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnvironmentActionResponse message, length delimited. Does not implicitly {@link role.v1.EnvironmentActionResponse.verify|verify} messages.
             * @param message EnvironmentActionResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IEnvironmentActionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnvironmentActionResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnvironmentActionResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.EnvironmentActionResponse;

            /**
             * Decodes an EnvironmentActionResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnvironmentActionResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.EnvironmentActionResponse;

            /**
             * Verifies an EnvironmentActionResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnvironmentActionResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnvironmentActionResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.EnvironmentActionResponse;

            /**
             * Creates a plain object from an EnvironmentActionResponse message. Also converts values to other types if specified.
             * @param message EnvironmentActionResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.EnvironmentActionResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnvironmentActionResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for EnvironmentActionResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Represents an EnvironmentsService */
        class EnvironmentsService extends $protobuf.rpc.Service {

            /**
             * Constructs a new EnvironmentsService service.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             */
            constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

            /**
             * Creates new EnvironmentsService service using the specified rpc implementation.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             * @returns RPC service. Useful where requests and/or responses are streamed.
             */
            public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): EnvironmentsService;

            /**
             * Calls List.
             * @param request EnvironmentListRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and EnvironmentItemsResponse
             */
            public list(request: role.v1.IEnvironmentListRequest, callback: role.v1.EnvironmentsService.ListCallback): void;

            /**
             * Calls List.
             * @param request EnvironmentListRequest message or plain object
             * @returns Promise
             */
            public list(request: role.v1.IEnvironmentListRequest): Promise<role.v1.EnvironmentItemsResponse>;

            /**
             * Calls GetById.
             * @param request EnvironmentByIdRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and EnvironmentItemResponse
             */
            public getById(request: role.v1.IEnvironmentByIdRequest, callback: role.v1.EnvironmentsService.GetByIdCallback): void;

            /**
             * Calls GetById.
             * @param request EnvironmentByIdRequest message or plain object
             * @returns Promise
             */
            public getById(request: role.v1.IEnvironmentByIdRequest): Promise<role.v1.EnvironmentItemResponse>;

            /**
             * Calls Create.
             * @param request EnvironmentCreateRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and EnvironmentItemResponse
             */
            public create(request: role.v1.IEnvironmentCreateRequest, callback: role.v1.EnvironmentsService.CreateCallback): void;

            /**
             * Calls Create.
             * @param request EnvironmentCreateRequest message or plain object
             * @returns Promise
             */
            public create(request: role.v1.IEnvironmentCreateRequest): Promise<role.v1.EnvironmentItemResponse>;

            /**
             * Calls Update.
             * @param request EnvironmentUpdateRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and EnvironmentItemResponse
             */
            public update(request: role.v1.IEnvironmentUpdateRequest, callback: role.v1.EnvironmentsService.UpdateCallback): void;

            /**
             * Calls Update.
             * @param request EnvironmentUpdateRequest message or plain object
             * @returns Promise
             */
            public update(request: role.v1.IEnvironmentUpdateRequest): Promise<role.v1.EnvironmentItemResponse>;

            /**
             * Calls Delete.
             * @param request EnvironmentByIdRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and EnvironmentActionResponse
             */
            public delete(request: role.v1.IEnvironmentByIdRequest, callback: role.v1.EnvironmentsService.DeleteCallback): void;

            /**
             * Calls Delete.
             * @param request EnvironmentByIdRequest message or plain object
             * @returns Promise
             */
            public delete(request: role.v1.IEnvironmentByIdRequest): Promise<role.v1.EnvironmentActionResponse>;

            /**
             * Calls ListVariables.
             * @param request EnvironmentByIdRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and EnvironmentVariableItemsResponse
             */
            public listVariables(request: role.v1.IEnvironmentByIdRequest, callback: role.v1.EnvironmentsService.ListVariablesCallback): void;

            /**
             * Calls ListVariables.
             * @param request EnvironmentByIdRequest message or plain object
             * @returns Promise
             */
            public listVariables(request: role.v1.IEnvironmentByIdRequest): Promise<role.v1.EnvironmentVariableItemsResponse>;

            /**
             * Calls GetVariableById.
             * @param request EnvironmentVariableByIdRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and EnvironmentVariableItemResponse
             */
            public getVariableById(request: role.v1.IEnvironmentVariableByIdRequest, callback: role.v1.EnvironmentsService.GetVariableByIdCallback): void;

            /**
             * Calls GetVariableById.
             * @param request EnvironmentVariableByIdRequest message or plain object
             * @returns Promise
             */
            public getVariableById(request: role.v1.IEnvironmentVariableByIdRequest): Promise<role.v1.EnvironmentVariableItemResponse>;

            /**
             * Calls CreateVariable.
             * @param request EnvironmentVariableCreateRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and EnvironmentVariableItemResponse
             */
            public createVariable(request: role.v1.IEnvironmentVariableCreateRequest, callback: role.v1.EnvironmentsService.CreateVariableCallback): void;

            /**
             * Calls CreateVariable.
             * @param request EnvironmentVariableCreateRequest message or plain object
             * @returns Promise
             */
            public createVariable(request: role.v1.IEnvironmentVariableCreateRequest): Promise<role.v1.EnvironmentVariableItemResponse>;

            /**
             * Calls UpdateVariable.
             * @param request EnvironmentVariableUpdateRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and EnvironmentVariableItemResponse
             */
            public updateVariable(request: role.v1.IEnvironmentVariableUpdateRequest, callback: role.v1.EnvironmentsService.UpdateVariableCallback): void;

            /**
             * Calls UpdateVariable.
             * @param request EnvironmentVariableUpdateRequest message or plain object
             * @returns Promise
             */
            public updateVariable(request: role.v1.IEnvironmentVariableUpdateRequest): Promise<role.v1.EnvironmentVariableItemResponse>;

            /**
             * Calls DeleteVariable.
             * @param request EnvironmentVariableByIdRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and EnvironmentActionResponse
             */
            public deleteVariable(request: role.v1.IEnvironmentVariableByIdRequest, callback: role.v1.EnvironmentsService.DeleteVariableCallback): void;

            /**
             * Calls DeleteVariable.
             * @param request EnvironmentVariableByIdRequest message or plain object
             * @returns Promise
             */
            public deleteVariable(request: role.v1.IEnvironmentVariableByIdRequest): Promise<role.v1.EnvironmentActionResponse>;
        }

        namespace EnvironmentsService {

            /**
             * Callback as used by {@link role.v1.EnvironmentsService#list}.
             * @param error Error, if any
             * @param [response] EnvironmentItemsResponse
             */
            type ListCallback = (error: (Error|null), response?: role.v1.EnvironmentItemsResponse) => void;

            /**
             * Callback as used by {@link role.v1.EnvironmentsService#getById}.
             * @param error Error, if any
             * @param [response] EnvironmentItemResponse
             */
            type GetByIdCallback = (error: (Error|null), response?: role.v1.EnvironmentItemResponse) => void;

            /**
             * Callback as used by {@link role.v1.EnvironmentsService#create}.
             * @param error Error, if any
             * @param [response] EnvironmentItemResponse
             */
            type CreateCallback = (error: (Error|null), response?: role.v1.EnvironmentItemResponse) => void;

            /**
             * Callback as used by {@link role.v1.EnvironmentsService#update}.
             * @param error Error, if any
             * @param [response] EnvironmentItemResponse
             */
            type UpdateCallback = (error: (Error|null), response?: role.v1.EnvironmentItemResponse) => void;

            /**
             * Callback as used by {@link role.v1.EnvironmentsService#delete_}.
             * @param error Error, if any
             * @param [response] EnvironmentActionResponse
             */
            type DeleteCallback = (error: (Error|null), response?: role.v1.EnvironmentActionResponse) => void;

            /**
             * Callback as used by {@link role.v1.EnvironmentsService#listVariables}.
             * @param error Error, if any
             * @param [response] EnvironmentVariableItemsResponse
             */
            type ListVariablesCallback = (error: (Error|null), response?: role.v1.EnvironmentVariableItemsResponse) => void;

            /**
             * Callback as used by {@link role.v1.EnvironmentsService#getVariableById}.
             * @param error Error, if any
             * @param [response] EnvironmentVariableItemResponse
             */
            type GetVariableByIdCallback = (error: (Error|null), response?: role.v1.EnvironmentVariableItemResponse) => void;

            /**
             * Callback as used by {@link role.v1.EnvironmentsService#createVariable}.
             * @param error Error, if any
             * @param [response] EnvironmentVariableItemResponse
             */
            type CreateVariableCallback = (error: (Error|null), response?: role.v1.EnvironmentVariableItemResponse) => void;

            /**
             * Callback as used by {@link role.v1.EnvironmentsService#updateVariable}.
             * @param error Error, if any
             * @param [response] EnvironmentVariableItemResponse
             */
            type UpdateVariableCallback = (error: (Error|null), response?: role.v1.EnvironmentVariableItemResponse) => void;

            /**
             * Callback as used by {@link role.v1.EnvironmentsService#deleteVariable}.
             * @param error Error, if any
             * @param [response] EnvironmentActionResponse
             */
            type DeleteVariableCallback = (error: (Error|null), response?: role.v1.EnvironmentActionResponse) => void;
        }

        /** Properties of a HealthCheckRequest. */
        interface IHealthCheckRequest {

            /** HealthCheckRequest service */
            service?: (string|null);
        }

        /** Represents a HealthCheckRequest. */
        class HealthCheckRequest implements IHealthCheckRequest {

            /**
             * Constructs a new HealthCheckRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IHealthCheckRequest);

            /** HealthCheckRequest service. */
            public service: string;

            /**
             * Creates a new HealthCheckRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns HealthCheckRequest instance
             */
            public static create(properties?: role.v1.IHealthCheckRequest): role.v1.HealthCheckRequest;

            /**
             * Encodes the specified HealthCheckRequest message. Does not implicitly {@link role.v1.HealthCheckRequest.verify|verify} messages.
             * @param message HealthCheckRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IHealthCheckRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified HealthCheckRequest message, length delimited. Does not implicitly {@link role.v1.HealthCheckRequest.verify|verify} messages.
             * @param message HealthCheckRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IHealthCheckRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a HealthCheckRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns HealthCheckRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.HealthCheckRequest;

            /**
             * Decodes a HealthCheckRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns HealthCheckRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.HealthCheckRequest;

            /**
             * Verifies a HealthCheckRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a HealthCheckRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns HealthCheckRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.HealthCheckRequest;

            /**
             * Creates a plain object from a HealthCheckRequest message. Also converts values to other types if specified.
             * @param message HealthCheckRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.HealthCheckRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this HealthCheckRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for HealthCheckRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a HealthCheckResponse. */
        interface IHealthCheckResponse {

            /** HealthCheckResponse status */
            status?: (string|null);

            /** HealthCheckResponse service */
            service?: (string|null);

            /** HealthCheckResponse uptimeSeconds */
            uptimeSeconds?: (number|Long|null);
        }

        /** Represents a HealthCheckResponse. */
        class HealthCheckResponse implements IHealthCheckResponse {

            /**
             * Constructs a new HealthCheckResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IHealthCheckResponse);

            /** HealthCheckResponse status. */
            public status: string;

            /** HealthCheckResponse service. */
            public service: string;

            /** HealthCheckResponse uptimeSeconds. */
            public uptimeSeconds: (number|Long);

            /**
             * Creates a new HealthCheckResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns HealthCheckResponse instance
             */
            public static create(properties?: role.v1.IHealthCheckResponse): role.v1.HealthCheckResponse;

            /**
             * Encodes the specified HealthCheckResponse message. Does not implicitly {@link role.v1.HealthCheckResponse.verify|verify} messages.
             * @param message HealthCheckResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IHealthCheckResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified HealthCheckResponse message, length delimited. Does not implicitly {@link role.v1.HealthCheckResponse.verify|verify} messages.
             * @param message HealthCheckResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IHealthCheckResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a HealthCheckResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns HealthCheckResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.HealthCheckResponse;

            /**
             * Decodes a HealthCheckResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns HealthCheckResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.HealthCheckResponse;

            /**
             * Verifies a HealthCheckResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a HealthCheckResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns HealthCheckResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.HealthCheckResponse;

            /**
             * Creates a plain object from a HealthCheckResponse message. Also converts values to other types if specified.
             * @param message HealthCheckResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.HealthCheckResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this HealthCheckResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for HealthCheckResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Represents a HealthService */
        class HealthService extends $protobuf.rpc.Service {

            /**
             * Constructs a new HealthService service.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             */
            constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

            /**
             * Creates new HealthService service using the specified rpc implementation.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             * @returns RPC service. Useful where requests and/or responses are streamed.
             */
            public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): HealthService;

            /**
             * Calls Check.
             * @param request HealthCheckRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and HealthCheckResponse
             */
            public check(request: role.v1.IHealthCheckRequest, callback: role.v1.HealthService.CheckCallback): void;

            /**
             * Calls Check.
             * @param request HealthCheckRequest message or plain object
             * @returns Promise
             */
            public check(request: role.v1.IHealthCheckRequest): Promise<role.v1.HealthCheckResponse>;
        }

        namespace HealthService {

            /**
             * Callback as used by {@link role.v1.HealthService#check}.
             * @param error Error, if any
             * @param [response] HealthCheckResponse
             */
            type CheckCallback = (error: (Error|null), response?: role.v1.HealthCheckResponse) => void;
        }

        /** Properties of an ImportExportWorkspaceRequest. */
        interface IImportExportWorkspaceRequest {

            /** ImportExportWorkspaceRequest workspaceId */
            workspaceId?: (number|Long|null);
        }

        /** Represents an ImportExportWorkspaceRequest. */
        class ImportExportWorkspaceRequest implements IImportExportWorkspaceRequest {

            /**
             * Constructs a new ImportExportWorkspaceRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IImportExportWorkspaceRequest);

            /** ImportExportWorkspaceRequest workspaceId. */
            public workspaceId: (number|Long);

            /**
             * Creates a new ImportExportWorkspaceRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ImportExportWorkspaceRequest instance
             */
            public static create(properties?: role.v1.IImportExportWorkspaceRequest): role.v1.ImportExportWorkspaceRequest;

            /**
             * Encodes the specified ImportExportWorkspaceRequest message. Does not implicitly {@link role.v1.ImportExportWorkspaceRequest.verify|verify} messages.
             * @param message ImportExportWorkspaceRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IImportExportWorkspaceRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ImportExportWorkspaceRequest message, length delimited. Does not implicitly {@link role.v1.ImportExportWorkspaceRequest.verify|verify} messages.
             * @param message ImportExportWorkspaceRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IImportExportWorkspaceRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ImportExportWorkspaceRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ImportExportWorkspaceRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.ImportExportWorkspaceRequest;

            /**
             * Decodes an ImportExportWorkspaceRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ImportExportWorkspaceRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.ImportExportWorkspaceRequest;

            /**
             * Verifies an ImportExportWorkspaceRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ImportExportWorkspaceRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ImportExportWorkspaceRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.ImportExportWorkspaceRequest;

            /**
             * Creates a plain object from an ImportExportWorkspaceRequest message. Also converts values to other types if specified.
             * @param message ImportExportWorkspaceRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.ImportExportWorkspaceRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ImportExportWorkspaceRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ImportExportWorkspaceRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an ImportExportJobByIdRequest. */
        interface IImportExportJobByIdRequest {

            /** ImportExportJobByIdRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** ImportExportJobByIdRequest jobId */
            jobId?: (number|Long|null);
        }

        /** Represents an ImportExportJobByIdRequest. */
        class ImportExportJobByIdRequest implements IImportExportJobByIdRequest {

            /**
             * Constructs a new ImportExportJobByIdRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IImportExportJobByIdRequest);

            /** ImportExportJobByIdRequest workspaceId. */
            public workspaceId: (number|Long);

            /** ImportExportJobByIdRequest jobId. */
            public jobId: (number|Long);

            /**
             * Creates a new ImportExportJobByIdRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ImportExportJobByIdRequest instance
             */
            public static create(properties?: role.v1.IImportExportJobByIdRequest): role.v1.ImportExportJobByIdRequest;

            /**
             * Encodes the specified ImportExportJobByIdRequest message. Does not implicitly {@link role.v1.ImportExportJobByIdRequest.verify|verify} messages.
             * @param message ImportExportJobByIdRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IImportExportJobByIdRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ImportExportJobByIdRequest message, length delimited. Does not implicitly {@link role.v1.ImportExportJobByIdRequest.verify|verify} messages.
             * @param message ImportExportJobByIdRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IImportExportJobByIdRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ImportExportJobByIdRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ImportExportJobByIdRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.ImportExportJobByIdRequest;

            /**
             * Decodes an ImportExportJobByIdRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ImportExportJobByIdRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.ImportExportJobByIdRequest;

            /**
             * Verifies an ImportExportJobByIdRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ImportExportJobByIdRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ImportExportJobByIdRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.ImportExportJobByIdRequest;

            /**
             * Creates a plain object from an ImportExportJobByIdRequest message. Also converts values to other types if specified.
             * @param message ImportExportJobByIdRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.ImportExportJobByIdRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ImportExportJobByIdRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ImportExportJobByIdRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CreateExportJobRequest. */
        interface ICreateExportJobRequest {

            /** CreateExportJobRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** CreateExportJobRequest payloadJson */
            payloadJson?: (string|null);
        }

        /** Represents a CreateExportJobRequest. */
        class CreateExportJobRequest implements ICreateExportJobRequest {

            /**
             * Constructs a new CreateExportJobRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICreateExportJobRequest);

            /** CreateExportJobRequest workspaceId. */
            public workspaceId: (number|Long);

            /** CreateExportJobRequest payloadJson. */
            public payloadJson: string;

            /**
             * Creates a new CreateExportJobRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CreateExportJobRequest instance
             */
            public static create(properties?: role.v1.ICreateExportJobRequest): role.v1.CreateExportJobRequest;

            /**
             * Encodes the specified CreateExportJobRequest message. Does not implicitly {@link role.v1.CreateExportJobRequest.verify|verify} messages.
             * @param message CreateExportJobRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICreateExportJobRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CreateExportJobRequest message, length delimited. Does not implicitly {@link role.v1.CreateExportJobRequest.verify|verify} messages.
             * @param message CreateExportJobRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICreateExportJobRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CreateExportJobRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CreateExportJobRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CreateExportJobRequest;

            /**
             * Decodes a CreateExportJobRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CreateExportJobRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CreateExportJobRequest;

            /**
             * Verifies a CreateExportJobRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CreateExportJobRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CreateExportJobRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CreateExportJobRequest;

            /**
             * Creates a plain object from a CreateExportJobRequest message. Also converts values to other types if specified.
             * @param message CreateExportJobRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CreateExportJobRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CreateExportJobRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CreateExportJobRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CreateImportJobRequest. */
        interface ICreateImportJobRequest {

            /** CreateImportJobRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** CreateImportJobRequest payloadJson */
            payloadJson?: (string|null);
        }

        /** Represents a CreateImportJobRequest. */
        class CreateImportJobRequest implements ICreateImportJobRequest {

            /**
             * Constructs a new CreateImportJobRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICreateImportJobRequest);

            /** CreateImportJobRequest workspaceId. */
            public workspaceId: (number|Long);

            /** CreateImportJobRequest payloadJson. */
            public payloadJson: string;

            /**
             * Creates a new CreateImportJobRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CreateImportJobRequest instance
             */
            public static create(properties?: role.v1.ICreateImportJobRequest): role.v1.CreateImportJobRequest;

            /**
             * Encodes the specified CreateImportJobRequest message. Does not implicitly {@link role.v1.CreateImportJobRequest.verify|verify} messages.
             * @param message CreateImportJobRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICreateImportJobRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CreateImportJobRequest message, length delimited. Does not implicitly {@link role.v1.CreateImportJobRequest.verify|verify} messages.
             * @param message CreateImportJobRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICreateImportJobRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CreateImportJobRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CreateImportJobRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CreateImportJobRequest;

            /**
             * Decodes a CreateImportJobRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CreateImportJobRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CreateImportJobRequest;

            /**
             * Verifies a CreateImportJobRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CreateImportJobRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CreateImportJobRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CreateImportJobRequest;

            /**
             * Creates a plain object from a CreateImportJobRequest message. Also converts values to other types if specified.
             * @param message CreateImportJobRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CreateImportJobRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CreateImportJobRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CreateImportJobRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an ImportExportJobResponse. */
        interface IImportExportJobResponse {

            /** ImportExportJobResponse jobJson */
            jobJson?: (string|null);
        }

        /** Represents an ImportExportJobResponse. */
        class ImportExportJobResponse implements IImportExportJobResponse {

            /**
             * Constructs a new ImportExportJobResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IImportExportJobResponse);

            /** ImportExportJobResponse jobJson. */
            public jobJson: string;

            /**
             * Creates a new ImportExportJobResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ImportExportJobResponse instance
             */
            public static create(properties?: role.v1.IImportExportJobResponse): role.v1.ImportExportJobResponse;

            /**
             * Encodes the specified ImportExportJobResponse message. Does not implicitly {@link role.v1.ImportExportJobResponse.verify|verify} messages.
             * @param message ImportExportJobResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IImportExportJobResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ImportExportJobResponse message, length delimited. Does not implicitly {@link role.v1.ImportExportJobResponse.verify|verify} messages.
             * @param message ImportExportJobResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IImportExportJobResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ImportExportJobResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ImportExportJobResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.ImportExportJobResponse;

            /**
             * Decodes an ImportExportJobResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ImportExportJobResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.ImportExportJobResponse;

            /**
             * Verifies an ImportExportJobResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ImportExportJobResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ImportExportJobResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.ImportExportJobResponse;

            /**
             * Creates a plain object from an ImportExportJobResponse message. Also converts values to other types if specified.
             * @param message ImportExportJobResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.ImportExportJobResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ImportExportJobResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ImportExportJobResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an ImportExportJobsResponse. */
        interface IImportExportJobsResponse {

            /** ImportExportJobsResponse jobsJson */
            jobsJson?: (string[]|null);
        }

        /** Represents an ImportExportJobsResponse. */
        class ImportExportJobsResponse implements IImportExportJobsResponse {

            /**
             * Constructs a new ImportExportJobsResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IImportExportJobsResponse);

            /** ImportExportJobsResponse jobsJson. */
            public jobsJson: string[];

            /**
             * Creates a new ImportExportJobsResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ImportExportJobsResponse instance
             */
            public static create(properties?: role.v1.IImportExportJobsResponse): role.v1.ImportExportJobsResponse;

            /**
             * Encodes the specified ImportExportJobsResponse message. Does not implicitly {@link role.v1.ImportExportJobsResponse.verify|verify} messages.
             * @param message ImportExportJobsResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IImportExportJobsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ImportExportJobsResponse message, length delimited. Does not implicitly {@link role.v1.ImportExportJobsResponse.verify|verify} messages.
             * @param message ImportExportJobsResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IImportExportJobsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ImportExportJobsResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ImportExportJobsResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.ImportExportJobsResponse;

            /**
             * Decodes an ImportExportJobsResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ImportExportJobsResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.ImportExportJobsResponse;

            /**
             * Verifies an ImportExportJobsResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ImportExportJobsResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ImportExportJobsResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.ImportExportJobsResponse;

            /**
             * Creates a plain object from an ImportExportJobsResponse message. Also converts values to other types if specified.
             * @param message ImportExportJobsResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.ImportExportJobsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ImportExportJobsResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ImportExportJobsResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Represents an ImportExportService */
        class ImportExportService extends $protobuf.rpc.Service {

            /**
             * Constructs a new ImportExportService service.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             */
            constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

            /**
             * Creates new ImportExportService service using the specified rpc implementation.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             * @returns RPC service. Useful where requests and/or responses are streamed.
             */
            public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): ImportExportService;

            /**
             * Calls ListJobs.
             * @param request ImportExportWorkspaceRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and ImportExportJobsResponse
             */
            public listJobs(request: role.v1.IImportExportWorkspaceRequest, callback: role.v1.ImportExportService.ListJobsCallback): void;

            /**
             * Calls ListJobs.
             * @param request ImportExportWorkspaceRequest message or plain object
             * @returns Promise
             */
            public listJobs(request: role.v1.IImportExportWorkspaceRequest): Promise<role.v1.ImportExportJobsResponse>;

            /**
             * Calls GetJobById.
             * @param request ImportExportJobByIdRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and ImportExportJobResponse
             */
            public getJobById(request: role.v1.IImportExportJobByIdRequest, callback: role.v1.ImportExportService.GetJobByIdCallback): void;

            /**
             * Calls GetJobById.
             * @param request ImportExportJobByIdRequest message or plain object
             * @returns Promise
             */
            public getJobById(request: role.v1.IImportExportJobByIdRequest): Promise<role.v1.ImportExportJobResponse>;

            /**
             * Calls CreateExportJob.
             * @param request CreateExportJobRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and ImportExportJobResponse
             */
            public createExportJob(request: role.v1.ICreateExportJobRequest, callback: role.v1.ImportExportService.CreateExportJobCallback): void;

            /**
             * Calls CreateExportJob.
             * @param request CreateExportJobRequest message or plain object
             * @returns Promise
             */
            public createExportJob(request: role.v1.ICreateExportJobRequest): Promise<role.v1.ImportExportJobResponse>;

            /**
             * Calls CreateImportJob.
             * @param request CreateImportJobRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and ImportExportJobResponse
             */
            public createImportJob(request: role.v1.ICreateImportJobRequest, callback: role.v1.ImportExportService.CreateImportJobCallback): void;

            /**
             * Calls CreateImportJob.
             * @param request CreateImportJobRequest message or plain object
             * @returns Promise
             */
            public createImportJob(request: role.v1.ICreateImportJobRequest): Promise<role.v1.ImportExportJobResponse>;
        }

        namespace ImportExportService {

            /**
             * Callback as used by {@link role.v1.ImportExportService#listJobs}.
             * @param error Error, if any
             * @param [response] ImportExportJobsResponse
             */
            type ListJobsCallback = (error: (Error|null), response?: role.v1.ImportExportJobsResponse) => void;

            /**
             * Callback as used by {@link role.v1.ImportExportService#getJobById}.
             * @param error Error, if any
             * @param [response] ImportExportJobResponse
             */
            type GetJobByIdCallback = (error: (Error|null), response?: role.v1.ImportExportJobResponse) => void;

            /**
             * Callback as used by {@link role.v1.ImportExportService#createExportJob}.
             * @param error Error, if any
             * @param [response] ImportExportJobResponse
             */
            type CreateExportJobCallback = (error: (Error|null), response?: role.v1.ImportExportJobResponse) => void;

            /**
             * Callback as used by {@link role.v1.ImportExportService#createImportJob}.
             * @param error Error, if any
             * @param [response] ImportExportJobResponse
             */
            type CreateImportJobCallback = (error: (Error|null), response?: role.v1.ImportExportJobResponse) => void;
        }

        /** Properties of a RunByIdRequest. */
        interface IRunByIdRequest {

            /** RunByIdRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** RunByIdRequest runId */
            runId?: (number|Long|null);
        }

        /** Represents a RunByIdRequest. */
        class RunByIdRequest implements IRunByIdRequest {

            /**
             * Constructs a new RunByIdRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IRunByIdRequest);

            /** RunByIdRequest workspaceId. */
            public workspaceId: (number|Long);

            /** RunByIdRequest runId. */
            public runId: (number|Long);

            /**
             * Creates a new RunByIdRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns RunByIdRequest instance
             */
            public static create(properties?: role.v1.IRunByIdRequest): role.v1.RunByIdRequest;

            /**
             * Encodes the specified RunByIdRequest message. Does not implicitly {@link role.v1.RunByIdRequest.verify|verify} messages.
             * @param message RunByIdRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IRunByIdRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RunByIdRequest message, length delimited. Does not implicitly {@link role.v1.RunByIdRequest.verify|verify} messages.
             * @param message RunByIdRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IRunByIdRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RunByIdRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RunByIdRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.RunByIdRequest;

            /**
             * Decodes a RunByIdRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RunByIdRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.RunByIdRequest;

            /**
             * Verifies a RunByIdRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a RunByIdRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns RunByIdRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.RunByIdRequest;

            /**
             * Creates a plain object from a RunByIdRequest message. Also converts values to other types if specified.
             * @param message RunByIdRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.RunByIdRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this RunByIdRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for RunByIdRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CreateRunRequest. */
        interface ICreateRunRequest {

            /** CreateRunRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** CreateRunRequest payloadJson */
            payloadJson?: (string|null);
        }

        /** Represents a CreateRunRequest. */
        class CreateRunRequest implements ICreateRunRequest {

            /**
             * Constructs a new CreateRunRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICreateRunRequest);

            /** CreateRunRequest workspaceId. */
            public workspaceId: (number|Long);

            /** CreateRunRequest payloadJson. */
            public payloadJson: string;

            /**
             * Creates a new CreateRunRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CreateRunRequest instance
             */
            public static create(properties?: role.v1.ICreateRunRequest): role.v1.CreateRunRequest;

            /**
             * Encodes the specified CreateRunRequest message. Does not implicitly {@link role.v1.CreateRunRequest.verify|verify} messages.
             * @param message CreateRunRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICreateRunRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CreateRunRequest message, length delimited. Does not implicitly {@link role.v1.CreateRunRequest.verify|verify} messages.
             * @param message CreateRunRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICreateRunRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CreateRunRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CreateRunRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CreateRunRequest;

            /**
             * Decodes a CreateRunRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CreateRunRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CreateRunRequest;

            /**
             * Verifies a CreateRunRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CreateRunRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CreateRunRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CreateRunRequest;

            /**
             * Creates a plain object from a CreateRunRequest message. Also converts values to other types if specified.
             * @param message CreateRunRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CreateRunRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CreateRunRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CreateRunRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a RunResponse. */
        interface IRunResponse {

            /** RunResponse runJson */
            runJson?: (string|null);
        }

        /** Represents a RunResponse. */
        class RunResponse implements IRunResponse {

            /**
             * Constructs a new RunResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IRunResponse);

            /** RunResponse runJson. */
            public runJson: string;

            /**
             * Creates a new RunResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns RunResponse instance
             */
            public static create(properties?: role.v1.IRunResponse): role.v1.RunResponse;

            /**
             * Encodes the specified RunResponse message. Does not implicitly {@link role.v1.RunResponse.verify|verify} messages.
             * @param message RunResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IRunResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RunResponse message, length delimited. Does not implicitly {@link role.v1.RunResponse.verify|verify} messages.
             * @param message RunResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IRunResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RunResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RunResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.RunResponse;

            /**
             * Decodes a RunResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RunResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.RunResponse;

            /**
             * Verifies a RunResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a RunResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns RunResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.RunResponse;

            /**
             * Creates a plain object from a RunResponse message. Also converts values to other types if specified.
             * @param message RunResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.RunResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this RunResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for RunResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Represents a RunsService */
        class RunsService extends $protobuf.rpc.Service {

            /**
             * Constructs a new RunsService service.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             */
            constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

            /**
             * Creates new RunsService service using the specified rpc implementation.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             * @returns RPC service. Useful where requests and/or responses are streamed.
             */
            public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): RunsService;

            /**
             * Calls Create.
             * @param request CreateRunRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and RunResponse
             */
            public create(request: role.v1.ICreateRunRequest, callback: role.v1.RunsService.CreateCallback): void;

            /**
             * Calls Create.
             * @param request CreateRunRequest message or plain object
             * @returns Promise
             */
            public create(request: role.v1.ICreateRunRequest): Promise<role.v1.RunResponse>;

            /**
             * Calls GetById.
             * @param request RunByIdRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and RunResponse
             */
            public getById(request: role.v1.IRunByIdRequest, callback: role.v1.RunsService.GetByIdCallback): void;

            /**
             * Calls GetById.
             * @param request RunByIdRequest message or plain object
             * @returns Promise
             */
            public getById(request: role.v1.IRunByIdRequest): Promise<role.v1.RunResponse>;

            /**
             * Calls Cancel.
             * @param request RunByIdRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and RunResponse
             */
            public cancel(request: role.v1.IRunByIdRequest, callback: role.v1.RunsService.CancelCallback): void;

            /**
             * Calls Cancel.
             * @param request RunByIdRequest message or plain object
             * @returns Promise
             */
            public cancel(request: role.v1.IRunByIdRequest): Promise<role.v1.RunResponse>;
        }

        namespace RunsService {

            /**
             * Callback as used by {@link role.v1.RunsService#create}.
             * @param error Error, if any
             * @param [response] RunResponse
             */
            type CreateCallback = (error: (Error|null), response?: role.v1.RunResponse) => void;

            /**
             * Callback as used by {@link role.v1.RunsService#getById}.
             * @param error Error, if any
             * @param [response] RunResponse
             */
            type GetByIdCallback = (error: (Error|null), response?: role.v1.RunResponse) => void;

            /**
             * Callback as used by {@link role.v1.RunsService#cancel}.
             * @param error Error, if any
             * @param [response] RunResponse
             */
            type CancelCallback = (error: (Error|null), response?: role.v1.RunResponse) => void;
        }

        /** Properties of a WorkspaceSummary. */
        interface IWorkspaceSummary {

            /** WorkspaceSummary id */
            id?: (number|Long|null);

            /** WorkspaceSummary legacyId */
            legacyId?: (number|Long|null);

            /** WorkspaceSummary name */
            name?: (string|null);

            /** WorkspaceSummary slug */
            slug?: (string|null);

            /** WorkspaceSummary type */
            type?: (string|null);

            /** WorkspaceSummary role */
            role?: (string|null);
        }

        /** Represents a WorkspaceSummary. */
        class WorkspaceSummary implements IWorkspaceSummary {

            /**
             * Constructs a new WorkspaceSummary.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IWorkspaceSummary);

            /** WorkspaceSummary id. */
            public id: (number|Long);

            /** WorkspaceSummary legacyId. */
            public legacyId: (number|Long);

            /** WorkspaceSummary name. */
            public name: string;

            /** WorkspaceSummary slug. */
            public slug: string;

            /** WorkspaceSummary type. */
            public type: string;

            /** WorkspaceSummary role. */
            public role: string;

            /**
             * Creates a new WorkspaceSummary instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WorkspaceSummary instance
             */
            public static create(properties?: role.v1.IWorkspaceSummary): role.v1.WorkspaceSummary;

            /**
             * Encodes the specified WorkspaceSummary message. Does not implicitly {@link role.v1.WorkspaceSummary.verify|verify} messages.
             * @param message WorkspaceSummary message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IWorkspaceSummary, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WorkspaceSummary message, length delimited. Does not implicitly {@link role.v1.WorkspaceSummary.verify|verify} messages.
             * @param message WorkspaceSummary message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IWorkspaceSummary, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WorkspaceSummary message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WorkspaceSummary
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.WorkspaceSummary;

            /**
             * Decodes a WorkspaceSummary message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WorkspaceSummary
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.WorkspaceSummary;

            /**
             * Verifies a WorkspaceSummary message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WorkspaceSummary message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WorkspaceSummary
             */
            public static fromObject(object: { [k: string]: any }): role.v1.WorkspaceSummary;

            /**
             * Creates a plain object from a WorkspaceSummary message. Also converts values to other types if specified.
             * @param message WorkspaceSummary
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.WorkspaceSummary, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WorkspaceSummary to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for WorkspaceSummary
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a WorkspaceMember. */
        interface IWorkspaceMember {

            /** WorkspaceMember userId */
            userId?: (number|Long|null);

            /** WorkspaceMember name */
            name?: (string|null);

            /** WorkspaceMember email */
            email?: (string|null);

            /** WorkspaceMember role */
            role?: (string|null);
        }

        /** Represents a WorkspaceMember. */
        class WorkspaceMember implements IWorkspaceMember {

            /**
             * Constructs a new WorkspaceMember.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IWorkspaceMember);

            /** WorkspaceMember userId. */
            public userId: (number|Long);

            /** WorkspaceMember name. */
            public name: string;

            /** WorkspaceMember email. */
            public email: string;

            /** WorkspaceMember role. */
            public role: string;

            /**
             * Creates a new WorkspaceMember instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WorkspaceMember instance
             */
            public static create(properties?: role.v1.IWorkspaceMember): role.v1.WorkspaceMember;

            /**
             * Encodes the specified WorkspaceMember message. Does not implicitly {@link role.v1.WorkspaceMember.verify|verify} messages.
             * @param message WorkspaceMember message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IWorkspaceMember, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WorkspaceMember message, length delimited. Does not implicitly {@link role.v1.WorkspaceMember.verify|verify} messages.
             * @param message WorkspaceMember message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IWorkspaceMember, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WorkspaceMember message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WorkspaceMember
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.WorkspaceMember;

            /**
             * Decodes a WorkspaceMember message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WorkspaceMember
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.WorkspaceMember;

            /**
             * Verifies a WorkspaceMember message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WorkspaceMember message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WorkspaceMember
             */
            public static fromObject(object: { [k: string]: any }): role.v1.WorkspaceMember;

            /**
             * Creates a plain object from a WorkspaceMember message. Also converts values to other types if specified.
             * @param message WorkspaceMember
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.WorkspaceMember, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WorkspaceMember to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for WorkspaceMember
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a WorkspaceInvitation. */
        interface IWorkspaceInvitation {

            /** WorkspaceInvitation id */
            id?: (number|Long|null);

            /** WorkspaceInvitation workspaceId */
            workspaceId?: (number|Long|null);

            /** WorkspaceInvitation email */
            email?: (string|null);

            /** WorkspaceInvitation role */
            role?: (string|null);

            /** WorkspaceInvitation token */
            token?: (string|null);

            /** WorkspaceInvitation expiresAt */
            expiresAt?: (string|null);
        }

        /** Represents a WorkspaceInvitation. */
        class WorkspaceInvitation implements IWorkspaceInvitation {

            /**
             * Constructs a new WorkspaceInvitation.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IWorkspaceInvitation);

            /** WorkspaceInvitation id. */
            public id: (number|Long);

            /** WorkspaceInvitation workspaceId. */
            public workspaceId: (number|Long);

            /** WorkspaceInvitation email. */
            public email: string;

            /** WorkspaceInvitation role. */
            public role: string;

            /** WorkspaceInvitation token. */
            public token: string;

            /** WorkspaceInvitation expiresAt. */
            public expiresAt: string;

            /**
             * Creates a new WorkspaceInvitation instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WorkspaceInvitation instance
             */
            public static create(properties?: role.v1.IWorkspaceInvitation): role.v1.WorkspaceInvitation;

            /**
             * Encodes the specified WorkspaceInvitation message. Does not implicitly {@link role.v1.WorkspaceInvitation.verify|verify} messages.
             * @param message WorkspaceInvitation message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IWorkspaceInvitation, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WorkspaceInvitation message, length delimited. Does not implicitly {@link role.v1.WorkspaceInvitation.verify|verify} messages.
             * @param message WorkspaceInvitation message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IWorkspaceInvitation, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WorkspaceInvitation message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WorkspaceInvitation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.WorkspaceInvitation;

            /**
             * Decodes a WorkspaceInvitation message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WorkspaceInvitation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.WorkspaceInvitation;

            /**
             * Verifies a WorkspaceInvitation message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WorkspaceInvitation message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WorkspaceInvitation
             */
            public static fromObject(object: { [k: string]: any }): role.v1.WorkspaceInvitation;

            /**
             * Creates a plain object from a WorkspaceInvitation message. Also converts values to other types if specified.
             * @param message WorkspaceInvitation
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.WorkspaceInvitation, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WorkspaceInvitation to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for WorkspaceInvitation
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a WorkspaceUpdate. */
        interface IWorkspaceUpdate {

            /** WorkspaceUpdate id */
            id?: (number|Long|null);

            /** WorkspaceUpdate workspaceId */
            workspaceId?: (number|Long|null);

            /** WorkspaceUpdate actorUserId */
            actorUserId?: (number|Long|null);

            /** WorkspaceUpdate entity */
            entity?: (string|null);

            /** WorkspaceUpdate action */
            action?: (string|null);

            /** WorkspaceUpdate entityId */
            entityId?: (number|Long|null);

            /** WorkspaceUpdate payloadJson */
            payloadJson?: (string|null);

            /** WorkspaceUpdate createdAt */
            createdAt?: (string|null);
        }

        /** Represents a WorkspaceUpdate. */
        class WorkspaceUpdate implements IWorkspaceUpdate {

            /**
             * Constructs a new WorkspaceUpdate.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IWorkspaceUpdate);

            /** WorkspaceUpdate id. */
            public id: (number|Long);

            /** WorkspaceUpdate workspaceId. */
            public workspaceId: (number|Long);

            /** WorkspaceUpdate actorUserId. */
            public actorUserId: (number|Long);

            /** WorkspaceUpdate entity. */
            public entity: string;

            /** WorkspaceUpdate action. */
            public action: string;

            /** WorkspaceUpdate entityId. */
            public entityId: (number|Long);

            /** WorkspaceUpdate payloadJson. */
            public payloadJson: string;

            /** WorkspaceUpdate createdAt. */
            public createdAt: string;

            /**
             * Creates a new WorkspaceUpdate instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WorkspaceUpdate instance
             */
            public static create(properties?: role.v1.IWorkspaceUpdate): role.v1.WorkspaceUpdate;

            /**
             * Encodes the specified WorkspaceUpdate message. Does not implicitly {@link role.v1.WorkspaceUpdate.verify|verify} messages.
             * @param message WorkspaceUpdate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IWorkspaceUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WorkspaceUpdate message, length delimited. Does not implicitly {@link role.v1.WorkspaceUpdate.verify|verify} messages.
             * @param message WorkspaceUpdate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IWorkspaceUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WorkspaceUpdate message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WorkspaceUpdate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.WorkspaceUpdate;

            /**
             * Decodes a WorkspaceUpdate message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WorkspaceUpdate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.WorkspaceUpdate;

            /**
             * Verifies a WorkspaceUpdate message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WorkspaceUpdate message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WorkspaceUpdate
             */
            public static fromObject(object: { [k: string]: any }): role.v1.WorkspaceUpdate;

            /**
             * Creates a plain object from a WorkspaceUpdate message. Also converts values to other types if specified.
             * @param message WorkspaceUpdate
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.WorkspaceUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WorkspaceUpdate to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for WorkspaceUpdate
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Cursor. */
        interface ICursor {

            /** Cursor next */
            next?: (number|Long|null);

            /** Cursor hasMore */
            hasMore?: (boolean|null);
        }

        /** Represents a Cursor. */
        class Cursor implements ICursor {

            /**
             * Constructs a new Cursor.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICursor);

            /** Cursor next. */
            public next: (number|Long);

            /** Cursor hasMore. */
            public hasMore: boolean;

            /**
             * Creates a new Cursor instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Cursor instance
             */
            public static create(properties?: role.v1.ICursor): role.v1.Cursor;

            /**
             * Encodes the specified Cursor message. Does not implicitly {@link role.v1.Cursor.verify|verify} messages.
             * @param message Cursor message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICursor, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Cursor message, length delimited. Does not implicitly {@link role.v1.Cursor.verify|verify} messages.
             * @param message Cursor message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICursor, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Cursor message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Cursor
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.Cursor;

            /**
             * Decodes a Cursor message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Cursor
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.Cursor;

            /**
             * Verifies a Cursor message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Cursor message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Cursor
             */
            public static fromObject(object: { [k: string]: any }): role.v1.Cursor;

            /**
             * Creates a plain object from a Cursor message. Also converts values to other types if specified.
             * @param message Cursor
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.Cursor, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Cursor to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Cursor
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ListWorkspacesRequest. */
        interface IListWorkspacesRequest {
        }

        /** Represents a ListWorkspacesRequest. */
        class ListWorkspacesRequest implements IListWorkspacesRequest {

            /**
             * Constructs a new ListWorkspacesRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IListWorkspacesRequest);

            /**
             * Creates a new ListWorkspacesRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ListWorkspacesRequest instance
             */
            public static create(properties?: role.v1.IListWorkspacesRequest): role.v1.ListWorkspacesRequest;

            /**
             * Encodes the specified ListWorkspacesRequest message. Does not implicitly {@link role.v1.ListWorkspacesRequest.verify|verify} messages.
             * @param message ListWorkspacesRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IListWorkspacesRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ListWorkspacesRequest message, length delimited. Does not implicitly {@link role.v1.ListWorkspacesRequest.verify|verify} messages.
             * @param message ListWorkspacesRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IListWorkspacesRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ListWorkspacesRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ListWorkspacesRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.ListWorkspacesRequest;

            /**
             * Decodes a ListWorkspacesRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ListWorkspacesRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.ListWorkspacesRequest;

            /**
             * Verifies a ListWorkspacesRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ListWorkspacesRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ListWorkspacesRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.ListWorkspacesRequest;

            /**
             * Creates a plain object from a ListWorkspacesRequest message. Also converts values to other types if specified.
             * @param message ListWorkspacesRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.ListWorkspacesRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ListWorkspacesRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ListWorkspacesRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ListWorkspacesResponse. */
        interface IListWorkspacesResponse {

            /** ListWorkspacesResponse items */
            items?: (role.v1.IWorkspaceSummary[]|null);
        }

        /** Represents a ListWorkspacesResponse. */
        class ListWorkspacesResponse implements IListWorkspacesResponse {

            /**
             * Constructs a new ListWorkspacesResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IListWorkspacesResponse);

            /** ListWorkspacesResponse items. */
            public items: role.v1.IWorkspaceSummary[];

            /**
             * Creates a new ListWorkspacesResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ListWorkspacesResponse instance
             */
            public static create(properties?: role.v1.IListWorkspacesResponse): role.v1.ListWorkspacesResponse;

            /**
             * Encodes the specified ListWorkspacesResponse message. Does not implicitly {@link role.v1.ListWorkspacesResponse.verify|verify} messages.
             * @param message ListWorkspacesResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IListWorkspacesResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ListWorkspacesResponse message, length delimited. Does not implicitly {@link role.v1.ListWorkspacesResponse.verify|verify} messages.
             * @param message ListWorkspacesResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IListWorkspacesResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ListWorkspacesResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ListWorkspacesResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.ListWorkspacesResponse;

            /**
             * Decodes a ListWorkspacesResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ListWorkspacesResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.ListWorkspacesResponse;

            /**
             * Verifies a ListWorkspacesResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ListWorkspacesResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ListWorkspacesResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.ListWorkspacesResponse;

            /**
             * Creates a plain object from a ListWorkspacesResponse message. Also converts values to other types if specified.
             * @param message ListWorkspacesResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.ListWorkspacesResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ListWorkspacesResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ListWorkspacesResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a WorkspaceIdRequest. */
        interface IWorkspaceIdRequest {

            /** WorkspaceIdRequest workspaceId */
            workspaceId?: (number|Long|null);
        }

        /** Represents a WorkspaceIdRequest. */
        class WorkspaceIdRequest implements IWorkspaceIdRequest {

            /**
             * Constructs a new WorkspaceIdRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IWorkspaceIdRequest);

            /** WorkspaceIdRequest workspaceId. */
            public workspaceId: (number|Long);

            /**
             * Creates a new WorkspaceIdRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WorkspaceIdRequest instance
             */
            public static create(properties?: role.v1.IWorkspaceIdRequest): role.v1.WorkspaceIdRequest;

            /**
             * Encodes the specified WorkspaceIdRequest message. Does not implicitly {@link role.v1.WorkspaceIdRequest.verify|verify} messages.
             * @param message WorkspaceIdRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IWorkspaceIdRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WorkspaceIdRequest message, length delimited. Does not implicitly {@link role.v1.WorkspaceIdRequest.verify|verify} messages.
             * @param message WorkspaceIdRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IWorkspaceIdRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WorkspaceIdRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WorkspaceIdRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.WorkspaceIdRequest;

            /**
             * Decodes a WorkspaceIdRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WorkspaceIdRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.WorkspaceIdRequest;

            /**
             * Verifies a WorkspaceIdRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WorkspaceIdRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WorkspaceIdRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.WorkspaceIdRequest;

            /**
             * Creates a plain object from a WorkspaceIdRequest message. Also converts values to other types if specified.
             * @param message WorkspaceIdRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.WorkspaceIdRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WorkspaceIdRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for WorkspaceIdRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a GetWorkspaceResponse. */
        interface IGetWorkspaceResponse {

            /** GetWorkspaceResponse item */
            item?: (role.v1.IWorkspaceSummary|null);
        }

        /** Represents a GetWorkspaceResponse. */
        class GetWorkspaceResponse implements IGetWorkspaceResponse {

            /**
             * Constructs a new GetWorkspaceResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IGetWorkspaceResponse);

            /** GetWorkspaceResponse item. */
            public item?: (role.v1.IWorkspaceSummary|null);

            /**
             * Creates a new GetWorkspaceResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns GetWorkspaceResponse instance
             */
            public static create(properties?: role.v1.IGetWorkspaceResponse): role.v1.GetWorkspaceResponse;

            /**
             * Encodes the specified GetWorkspaceResponse message. Does not implicitly {@link role.v1.GetWorkspaceResponse.verify|verify} messages.
             * @param message GetWorkspaceResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IGetWorkspaceResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified GetWorkspaceResponse message, length delimited. Does not implicitly {@link role.v1.GetWorkspaceResponse.verify|verify} messages.
             * @param message GetWorkspaceResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IGetWorkspaceResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a GetWorkspaceResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns GetWorkspaceResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.GetWorkspaceResponse;

            /**
             * Decodes a GetWorkspaceResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns GetWorkspaceResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.GetWorkspaceResponse;

            /**
             * Verifies a GetWorkspaceResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a GetWorkspaceResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns GetWorkspaceResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.GetWorkspaceResponse;

            /**
             * Creates a plain object from a GetWorkspaceResponse message. Also converts values to other types if specified.
             * @param message GetWorkspaceResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.GetWorkspaceResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this GetWorkspaceResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for GetWorkspaceResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CreateWorkspaceRequest. */
        interface ICreateWorkspaceRequest {

            /** CreateWorkspaceRequest name */
            name?: (string|null);
        }

        /** Represents a CreateWorkspaceRequest. */
        class CreateWorkspaceRequest implements ICreateWorkspaceRequest {

            /**
             * Constructs a new CreateWorkspaceRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICreateWorkspaceRequest);

            /** CreateWorkspaceRequest name. */
            public name: string;

            /**
             * Creates a new CreateWorkspaceRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CreateWorkspaceRequest instance
             */
            public static create(properties?: role.v1.ICreateWorkspaceRequest): role.v1.CreateWorkspaceRequest;

            /**
             * Encodes the specified CreateWorkspaceRequest message. Does not implicitly {@link role.v1.CreateWorkspaceRequest.verify|verify} messages.
             * @param message CreateWorkspaceRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICreateWorkspaceRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CreateWorkspaceRequest message, length delimited. Does not implicitly {@link role.v1.CreateWorkspaceRequest.verify|verify} messages.
             * @param message CreateWorkspaceRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICreateWorkspaceRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CreateWorkspaceRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CreateWorkspaceRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CreateWorkspaceRequest;

            /**
             * Decodes a CreateWorkspaceRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CreateWorkspaceRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CreateWorkspaceRequest;

            /**
             * Verifies a CreateWorkspaceRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CreateWorkspaceRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CreateWorkspaceRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CreateWorkspaceRequest;

            /**
             * Creates a plain object from a CreateWorkspaceRequest message. Also converts values to other types if specified.
             * @param message CreateWorkspaceRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CreateWorkspaceRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CreateWorkspaceRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CreateWorkspaceRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CreateWorkspaceResponse. */
        interface ICreateWorkspaceResponse {

            /** CreateWorkspaceResponse item */
            item?: (role.v1.IWorkspaceSummary|null);
        }

        /** Represents a CreateWorkspaceResponse. */
        class CreateWorkspaceResponse implements ICreateWorkspaceResponse {

            /**
             * Constructs a new CreateWorkspaceResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICreateWorkspaceResponse);

            /** CreateWorkspaceResponse item. */
            public item?: (role.v1.IWorkspaceSummary|null);

            /**
             * Creates a new CreateWorkspaceResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CreateWorkspaceResponse instance
             */
            public static create(properties?: role.v1.ICreateWorkspaceResponse): role.v1.CreateWorkspaceResponse;

            /**
             * Encodes the specified CreateWorkspaceResponse message. Does not implicitly {@link role.v1.CreateWorkspaceResponse.verify|verify} messages.
             * @param message CreateWorkspaceResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICreateWorkspaceResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CreateWorkspaceResponse message, length delimited. Does not implicitly {@link role.v1.CreateWorkspaceResponse.verify|verify} messages.
             * @param message CreateWorkspaceResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICreateWorkspaceResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CreateWorkspaceResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CreateWorkspaceResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CreateWorkspaceResponse;

            /**
             * Decodes a CreateWorkspaceResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CreateWorkspaceResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CreateWorkspaceResponse;

            /**
             * Verifies a CreateWorkspaceResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CreateWorkspaceResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CreateWorkspaceResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CreateWorkspaceResponse;

            /**
             * Creates a plain object from a CreateWorkspaceResponse message. Also converts values to other types if specified.
             * @param message CreateWorkspaceResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CreateWorkspaceResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CreateWorkspaceResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CreateWorkspaceResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ListWorkspaceMembersResponse. */
        interface IListWorkspaceMembersResponse {

            /** ListWorkspaceMembersResponse items */
            items?: (role.v1.IWorkspaceMember[]|null);
        }

        /** Represents a ListWorkspaceMembersResponse. */
        class ListWorkspaceMembersResponse implements IListWorkspaceMembersResponse {

            /**
             * Constructs a new ListWorkspaceMembersResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IListWorkspaceMembersResponse);

            /** ListWorkspaceMembersResponse items. */
            public items: role.v1.IWorkspaceMember[];

            /**
             * Creates a new ListWorkspaceMembersResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ListWorkspaceMembersResponse instance
             */
            public static create(properties?: role.v1.IListWorkspaceMembersResponse): role.v1.ListWorkspaceMembersResponse;

            /**
             * Encodes the specified ListWorkspaceMembersResponse message. Does not implicitly {@link role.v1.ListWorkspaceMembersResponse.verify|verify} messages.
             * @param message ListWorkspaceMembersResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IListWorkspaceMembersResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ListWorkspaceMembersResponse message, length delimited. Does not implicitly {@link role.v1.ListWorkspaceMembersResponse.verify|verify} messages.
             * @param message ListWorkspaceMembersResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IListWorkspaceMembersResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ListWorkspaceMembersResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ListWorkspaceMembersResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.ListWorkspaceMembersResponse;

            /**
             * Decodes a ListWorkspaceMembersResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ListWorkspaceMembersResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.ListWorkspaceMembersResponse;

            /**
             * Verifies a ListWorkspaceMembersResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ListWorkspaceMembersResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ListWorkspaceMembersResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.ListWorkspaceMembersResponse;

            /**
             * Creates a plain object from a ListWorkspaceMembersResponse message. Also converts values to other types if specified.
             * @param message ListWorkspaceMembersResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.ListWorkspaceMembersResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ListWorkspaceMembersResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ListWorkspaceMembersResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an AddWorkspaceMemberRequest. */
        interface IAddWorkspaceMemberRequest {

            /** AddWorkspaceMemberRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** AddWorkspaceMemberRequest email */
            email?: (string|null);

            /** AddWorkspaceMemberRequest role */
            role?: (string|null);
        }

        /** Represents an AddWorkspaceMemberRequest. */
        class AddWorkspaceMemberRequest implements IAddWorkspaceMemberRequest {

            /**
             * Constructs a new AddWorkspaceMemberRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IAddWorkspaceMemberRequest);

            /** AddWorkspaceMemberRequest workspaceId. */
            public workspaceId: (number|Long);

            /** AddWorkspaceMemberRequest email. */
            public email: string;

            /** AddWorkspaceMemberRequest role. */
            public role: string;

            /**
             * Creates a new AddWorkspaceMemberRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AddWorkspaceMemberRequest instance
             */
            public static create(properties?: role.v1.IAddWorkspaceMemberRequest): role.v1.AddWorkspaceMemberRequest;

            /**
             * Encodes the specified AddWorkspaceMemberRequest message. Does not implicitly {@link role.v1.AddWorkspaceMemberRequest.verify|verify} messages.
             * @param message AddWorkspaceMemberRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IAddWorkspaceMemberRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AddWorkspaceMemberRequest message, length delimited. Does not implicitly {@link role.v1.AddWorkspaceMemberRequest.verify|verify} messages.
             * @param message AddWorkspaceMemberRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IAddWorkspaceMemberRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AddWorkspaceMemberRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AddWorkspaceMemberRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.AddWorkspaceMemberRequest;

            /**
             * Decodes an AddWorkspaceMemberRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AddWorkspaceMemberRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.AddWorkspaceMemberRequest;

            /**
             * Verifies an AddWorkspaceMemberRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AddWorkspaceMemberRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AddWorkspaceMemberRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.AddWorkspaceMemberRequest;

            /**
             * Creates a plain object from an AddWorkspaceMemberRequest message. Also converts values to other types if specified.
             * @param message AddWorkspaceMemberRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.AddWorkspaceMemberRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AddWorkspaceMemberRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for AddWorkspaceMemberRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an AddWorkspaceMemberResponse. */
        interface IAddWorkspaceMemberResponse {

            /** AddWorkspaceMemberResponse item */
            item?: (role.v1.IWorkspaceMember|null);
        }

        /** Represents an AddWorkspaceMemberResponse. */
        class AddWorkspaceMemberResponse implements IAddWorkspaceMemberResponse {

            /**
             * Constructs a new AddWorkspaceMemberResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IAddWorkspaceMemberResponse);

            /** AddWorkspaceMemberResponse item. */
            public item?: (role.v1.IWorkspaceMember|null);

            /**
             * Creates a new AddWorkspaceMemberResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AddWorkspaceMemberResponse instance
             */
            public static create(properties?: role.v1.IAddWorkspaceMemberResponse): role.v1.AddWorkspaceMemberResponse;

            /**
             * Encodes the specified AddWorkspaceMemberResponse message. Does not implicitly {@link role.v1.AddWorkspaceMemberResponse.verify|verify} messages.
             * @param message AddWorkspaceMemberResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IAddWorkspaceMemberResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AddWorkspaceMemberResponse message, length delimited. Does not implicitly {@link role.v1.AddWorkspaceMemberResponse.verify|verify} messages.
             * @param message AddWorkspaceMemberResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IAddWorkspaceMemberResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AddWorkspaceMemberResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AddWorkspaceMemberResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.AddWorkspaceMemberResponse;

            /**
             * Decodes an AddWorkspaceMemberResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AddWorkspaceMemberResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.AddWorkspaceMemberResponse;

            /**
             * Verifies an AddWorkspaceMemberResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AddWorkspaceMemberResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AddWorkspaceMemberResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.AddWorkspaceMemberResponse;

            /**
             * Creates a plain object from an AddWorkspaceMemberResponse message. Also converts values to other types if specified.
             * @param message AddWorkspaceMemberResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.AddWorkspaceMemberResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AddWorkspaceMemberResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for AddWorkspaceMemberResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CreateWorkspaceInvitationRequest. */
        interface ICreateWorkspaceInvitationRequest {

            /** CreateWorkspaceInvitationRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** CreateWorkspaceInvitationRequest email */
            email?: (string|null);

            /** CreateWorkspaceInvitationRequest role */
            role?: (string|null);
        }

        /** Represents a CreateWorkspaceInvitationRequest. */
        class CreateWorkspaceInvitationRequest implements ICreateWorkspaceInvitationRequest {

            /**
             * Constructs a new CreateWorkspaceInvitationRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICreateWorkspaceInvitationRequest);

            /** CreateWorkspaceInvitationRequest workspaceId. */
            public workspaceId: (number|Long);

            /** CreateWorkspaceInvitationRequest email. */
            public email: string;

            /** CreateWorkspaceInvitationRequest role. */
            public role: string;

            /**
             * Creates a new CreateWorkspaceInvitationRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CreateWorkspaceInvitationRequest instance
             */
            public static create(properties?: role.v1.ICreateWorkspaceInvitationRequest): role.v1.CreateWorkspaceInvitationRequest;

            /**
             * Encodes the specified CreateWorkspaceInvitationRequest message. Does not implicitly {@link role.v1.CreateWorkspaceInvitationRequest.verify|verify} messages.
             * @param message CreateWorkspaceInvitationRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICreateWorkspaceInvitationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CreateWorkspaceInvitationRequest message, length delimited. Does not implicitly {@link role.v1.CreateWorkspaceInvitationRequest.verify|verify} messages.
             * @param message CreateWorkspaceInvitationRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICreateWorkspaceInvitationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CreateWorkspaceInvitationRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CreateWorkspaceInvitationRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CreateWorkspaceInvitationRequest;

            /**
             * Decodes a CreateWorkspaceInvitationRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CreateWorkspaceInvitationRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CreateWorkspaceInvitationRequest;

            /**
             * Verifies a CreateWorkspaceInvitationRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CreateWorkspaceInvitationRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CreateWorkspaceInvitationRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CreateWorkspaceInvitationRequest;

            /**
             * Creates a plain object from a CreateWorkspaceInvitationRequest message. Also converts values to other types if specified.
             * @param message CreateWorkspaceInvitationRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CreateWorkspaceInvitationRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CreateWorkspaceInvitationRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CreateWorkspaceInvitationRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CreateWorkspaceInvitationResponse. */
        interface ICreateWorkspaceInvitationResponse {

            /** CreateWorkspaceInvitationResponse item */
            item?: (role.v1.IWorkspaceInvitation|null);
        }

        /** Represents a CreateWorkspaceInvitationResponse. */
        class CreateWorkspaceInvitationResponse implements ICreateWorkspaceInvitationResponse {

            /**
             * Constructs a new CreateWorkspaceInvitationResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ICreateWorkspaceInvitationResponse);

            /** CreateWorkspaceInvitationResponse item. */
            public item?: (role.v1.IWorkspaceInvitation|null);

            /**
             * Creates a new CreateWorkspaceInvitationResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CreateWorkspaceInvitationResponse instance
             */
            public static create(properties?: role.v1.ICreateWorkspaceInvitationResponse): role.v1.CreateWorkspaceInvitationResponse;

            /**
             * Encodes the specified CreateWorkspaceInvitationResponse message. Does not implicitly {@link role.v1.CreateWorkspaceInvitationResponse.verify|verify} messages.
             * @param message CreateWorkspaceInvitationResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ICreateWorkspaceInvitationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CreateWorkspaceInvitationResponse message, length delimited. Does not implicitly {@link role.v1.CreateWorkspaceInvitationResponse.verify|verify} messages.
             * @param message CreateWorkspaceInvitationResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ICreateWorkspaceInvitationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CreateWorkspaceInvitationResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CreateWorkspaceInvitationResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.CreateWorkspaceInvitationResponse;

            /**
             * Decodes a CreateWorkspaceInvitationResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CreateWorkspaceInvitationResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.CreateWorkspaceInvitationResponse;

            /**
             * Verifies a CreateWorkspaceInvitationResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CreateWorkspaceInvitationResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CreateWorkspaceInvitationResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.CreateWorkspaceInvitationResponse;

            /**
             * Creates a plain object from a CreateWorkspaceInvitationResponse message. Also converts values to other types if specified.
             * @param message CreateWorkspaceInvitationResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.CreateWorkspaceInvitationResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CreateWorkspaceInvitationResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CreateWorkspaceInvitationResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an UpdateWorkspaceMemberRoleRequest. */
        interface IUpdateWorkspaceMemberRoleRequest {

            /** UpdateWorkspaceMemberRoleRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** UpdateWorkspaceMemberRoleRequest memberUserId */
            memberUserId?: (number|Long|null);

            /** UpdateWorkspaceMemberRoleRequest role */
            role?: (string|null);
        }

        /** Represents an UpdateWorkspaceMemberRoleRequest. */
        class UpdateWorkspaceMemberRoleRequest implements IUpdateWorkspaceMemberRoleRequest {

            /**
             * Constructs a new UpdateWorkspaceMemberRoleRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IUpdateWorkspaceMemberRoleRequest);

            /** UpdateWorkspaceMemberRoleRequest workspaceId. */
            public workspaceId: (number|Long);

            /** UpdateWorkspaceMemberRoleRequest memberUserId. */
            public memberUserId: (number|Long);

            /** UpdateWorkspaceMemberRoleRequest role. */
            public role: string;

            /**
             * Creates a new UpdateWorkspaceMemberRoleRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns UpdateWorkspaceMemberRoleRequest instance
             */
            public static create(properties?: role.v1.IUpdateWorkspaceMemberRoleRequest): role.v1.UpdateWorkspaceMemberRoleRequest;

            /**
             * Encodes the specified UpdateWorkspaceMemberRoleRequest message. Does not implicitly {@link role.v1.UpdateWorkspaceMemberRoleRequest.verify|verify} messages.
             * @param message UpdateWorkspaceMemberRoleRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IUpdateWorkspaceMemberRoleRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified UpdateWorkspaceMemberRoleRequest message, length delimited. Does not implicitly {@link role.v1.UpdateWorkspaceMemberRoleRequest.verify|verify} messages.
             * @param message UpdateWorkspaceMemberRoleRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IUpdateWorkspaceMemberRoleRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an UpdateWorkspaceMemberRoleRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UpdateWorkspaceMemberRoleRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.UpdateWorkspaceMemberRoleRequest;

            /**
             * Decodes an UpdateWorkspaceMemberRoleRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UpdateWorkspaceMemberRoleRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.UpdateWorkspaceMemberRoleRequest;

            /**
             * Verifies an UpdateWorkspaceMemberRoleRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an UpdateWorkspaceMemberRoleRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns UpdateWorkspaceMemberRoleRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.UpdateWorkspaceMemberRoleRequest;

            /**
             * Creates a plain object from an UpdateWorkspaceMemberRoleRequest message. Also converts values to other types if specified.
             * @param message UpdateWorkspaceMemberRoleRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.UpdateWorkspaceMemberRoleRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this UpdateWorkspaceMemberRoleRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for UpdateWorkspaceMemberRoleRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an UpdateWorkspaceMemberRoleResponse. */
        interface IUpdateWorkspaceMemberRoleResponse {

            /** UpdateWorkspaceMemberRoleResponse item */
            item?: (role.v1.IWorkspaceMember|null);
        }

        /** Represents an UpdateWorkspaceMemberRoleResponse. */
        class UpdateWorkspaceMemberRoleResponse implements IUpdateWorkspaceMemberRoleResponse {

            /**
             * Constructs a new UpdateWorkspaceMemberRoleResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IUpdateWorkspaceMemberRoleResponse);

            /** UpdateWorkspaceMemberRoleResponse item. */
            public item?: (role.v1.IWorkspaceMember|null);

            /**
             * Creates a new UpdateWorkspaceMemberRoleResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns UpdateWorkspaceMemberRoleResponse instance
             */
            public static create(properties?: role.v1.IUpdateWorkspaceMemberRoleResponse): role.v1.UpdateWorkspaceMemberRoleResponse;

            /**
             * Encodes the specified UpdateWorkspaceMemberRoleResponse message. Does not implicitly {@link role.v1.UpdateWorkspaceMemberRoleResponse.verify|verify} messages.
             * @param message UpdateWorkspaceMemberRoleResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IUpdateWorkspaceMemberRoleResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified UpdateWorkspaceMemberRoleResponse message, length delimited. Does not implicitly {@link role.v1.UpdateWorkspaceMemberRoleResponse.verify|verify} messages.
             * @param message UpdateWorkspaceMemberRoleResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IUpdateWorkspaceMemberRoleResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an UpdateWorkspaceMemberRoleResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UpdateWorkspaceMemberRoleResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.UpdateWorkspaceMemberRoleResponse;

            /**
             * Decodes an UpdateWorkspaceMemberRoleResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UpdateWorkspaceMemberRoleResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.UpdateWorkspaceMemberRoleResponse;

            /**
             * Verifies an UpdateWorkspaceMemberRoleResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an UpdateWorkspaceMemberRoleResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns UpdateWorkspaceMemberRoleResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.UpdateWorkspaceMemberRoleResponse;

            /**
             * Creates a plain object from an UpdateWorkspaceMemberRoleResponse message. Also converts values to other types if specified.
             * @param message UpdateWorkspaceMemberRoleResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.UpdateWorkspaceMemberRoleResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this UpdateWorkspaceMemberRoleResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for UpdateWorkspaceMemberRoleResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a RemoveWorkspaceMemberRequest. */
        interface IRemoveWorkspaceMemberRequest {

            /** RemoveWorkspaceMemberRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** RemoveWorkspaceMemberRequest memberUserId */
            memberUserId?: (number|Long|null);
        }

        /** Represents a RemoveWorkspaceMemberRequest. */
        class RemoveWorkspaceMemberRequest implements IRemoveWorkspaceMemberRequest {

            /**
             * Constructs a new RemoveWorkspaceMemberRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IRemoveWorkspaceMemberRequest);

            /** RemoveWorkspaceMemberRequest workspaceId. */
            public workspaceId: (number|Long);

            /** RemoveWorkspaceMemberRequest memberUserId. */
            public memberUserId: (number|Long);

            /**
             * Creates a new RemoveWorkspaceMemberRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns RemoveWorkspaceMemberRequest instance
             */
            public static create(properties?: role.v1.IRemoveWorkspaceMemberRequest): role.v1.RemoveWorkspaceMemberRequest;

            /**
             * Encodes the specified RemoveWorkspaceMemberRequest message. Does not implicitly {@link role.v1.RemoveWorkspaceMemberRequest.verify|verify} messages.
             * @param message RemoveWorkspaceMemberRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IRemoveWorkspaceMemberRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RemoveWorkspaceMemberRequest message, length delimited. Does not implicitly {@link role.v1.RemoveWorkspaceMemberRequest.verify|verify} messages.
             * @param message RemoveWorkspaceMemberRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IRemoveWorkspaceMemberRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RemoveWorkspaceMemberRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RemoveWorkspaceMemberRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.RemoveWorkspaceMemberRequest;

            /**
             * Decodes a RemoveWorkspaceMemberRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RemoveWorkspaceMemberRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.RemoveWorkspaceMemberRequest;

            /**
             * Verifies a RemoveWorkspaceMemberRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a RemoveWorkspaceMemberRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns RemoveWorkspaceMemberRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.RemoveWorkspaceMemberRequest;

            /**
             * Creates a plain object from a RemoveWorkspaceMemberRequest message. Also converts values to other types if specified.
             * @param message RemoveWorkspaceMemberRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.RemoveWorkspaceMemberRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this RemoveWorkspaceMemberRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for RemoveWorkspaceMemberRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an ActionResponse. */
        interface IActionResponse {

            /** ActionResponse status */
            status?: (string|null);
        }

        /** Represents an ActionResponse. */
        class ActionResponse implements IActionResponse {

            /**
             * Constructs a new ActionResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IActionResponse);

            /** ActionResponse status. */
            public status: string;

            /**
             * Creates a new ActionResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ActionResponse instance
             */
            public static create(properties?: role.v1.IActionResponse): role.v1.ActionResponse;

            /**
             * Encodes the specified ActionResponse message. Does not implicitly {@link role.v1.ActionResponse.verify|verify} messages.
             * @param message ActionResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IActionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ActionResponse message, length delimited. Does not implicitly {@link role.v1.ActionResponse.verify|verify} messages.
             * @param message ActionResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IActionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ActionResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ActionResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.ActionResponse;

            /**
             * Decodes an ActionResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ActionResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.ActionResponse;

            /**
             * Verifies an ActionResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ActionResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ActionResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.ActionResponse;

            /**
             * Creates a plain object from an ActionResponse message. Also converts values to other types if specified.
             * @param message ActionResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.ActionResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ActionResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ActionResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a JoinWorkspaceRequest. */
        interface IJoinWorkspaceRequest {

            /** JoinWorkspaceRequest token */
            token?: (string|null);
        }

        /** Represents a JoinWorkspaceRequest. */
        class JoinWorkspaceRequest implements IJoinWorkspaceRequest {

            /**
             * Constructs a new JoinWorkspaceRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IJoinWorkspaceRequest);

            /** JoinWorkspaceRequest token. */
            public token: string;

            /**
             * Creates a new JoinWorkspaceRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns JoinWorkspaceRequest instance
             */
            public static create(properties?: role.v1.IJoinWorkspaceRequest): role.v1.JoinWorkspaceRequest;

            /**
             * Encodes the specified JoinWorkspaceRequest message. Does not implicitly {@link role.v1.JoinWorkspaceRequest.verify|verify} messages.
             * @param message JoinWorkspaceRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IJoinWorkspaceRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified JoinWorkspaceRequest message, length delimited. Does not implicitly {@link role.v1.JoinWorkspaceRequest.verify|verify} messages.
             * @param message JoinWorkspaceRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IJoinWorkspaceRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a JoinWorkspaceRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns JoinWorkspaceRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.JoinWorkspaceRequest;

            /**
             * Decodes a JoinWorkspaceRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns JoinWorkspaceRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.JoinWorkspaceRequest;

            /**
             * Verifies a JoinWorkspaceRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a JoinWorkspaceRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns JoinWorkspaceRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.JoinWorkspaceRequest;

            /**
             * Creates a plain object from a JoinWorkspaceRequest message. Also converts values to other types if specified.
             * @param message JoinWorkspaceRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.JoinWorkspaceRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this JoinWorkspaceRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for JoinWorkspaceRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a JoinWorkspaceResponse. */
        interface IJoinWorkspaceResponse {

            /** JoinWorkspaceResponse item */
            item?: (role.v1.IWorkspaceSummary|null);
        }

        /** Represents a JoinWorkspaceResponse. */
        class JoinWorkspaceResponse implements IJoinWorkspaceResponse {

            /**
             * Constructs a new JoinWorkspaceResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IJoinWorkspaceResponse);

            /** JoinWorkspaceResponse item. */
            public item?: (role.v1.IWorkspaceSummary|null);

            /**
             * Creates a new JoinWorkspaceResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns JoinWorkspaceResponse instance
             */
            public static create(properties?: role.v1.IJoinWorkspaceResponse): role.v1.JoinWorkspaceResponse;

            /**
             * Encodes the specified JoinWorkspaceResponse message. Does not implicitly {@link role.v1.JoinWorkspaceResponse.verify|verify} messages.
             * @param message JoinWorkspaceResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IJoinWorkspaceResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified JoinWorkspaceResponse message, length delimited. Does not implicitly {@link role.v1.JoinWorkspaceResponse.verify|verify} messages.
             * @param message JoinWorkspaceResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IJoinWorkspaceResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a JoinWorkspaceResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns JoinWorkspaceResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.JoinWorkspaceResponse;

            /**
             * Decodes a JoinWorkspaceResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns JoinWorkspaceResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.JoinWorkspaceResponse;

            /**
             * Verifies a JoinWorkspaceResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a JoinWorkspaceResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns JoinWorkspaceResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.JoinWorkspaceResponse;

            /**
             * Creates a plain object from a JoinWorkspaceResponse message. Also converts values to other types if specified.
             * @param message JoinWorkspaceResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.JoinWorkspaceResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this JoinWorkspaceResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for JoinWorkspaceResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a LeaveWorkspaceRequest. */
        interface ILeaveWorkspaceRequest {

            /** LeaveWorkspaceRequest workspaceId */
            workspaceId?: (number|Long|null);
        }

        /** Represents a LeaveWorkspaceRequest. */
        class LeaveWorkspaceRequest implements ILeaveWorkspaceRequest {

            /**
             * Constructs a new LeaveWorkspaceRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.ILeaveWorkspaceRequest);

            /** LeaveWorkspaceRequest workspaceId. */
            public workspaceId: (number|Long);

            /**
             * Creates a new LeaveWorkspaceRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LeaveWorkspaceRequest instance
             */
            public static create(properties?: role.v1.ILeaveWorkspaceRequest): role.v1.LeaveWorkspaceRequest;

            /**
             * Encodes the specified LeaveWorkspaceRequest message. Does not implicitly {@link role.v1.LeaveWorkspaceRequest.verify|verify} messages.
             * @param message LeaveWorkspaceRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.ILeaveWorkspaceRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LeaveWorkspaceRequest message, length delimited. Does not implicitly {@link role.v1.LeaveWorkspaceRequest.verify|verify} messages.
             * @param message LeaveWorkspaceRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.ILeaveWorkspaceRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LeaveWorkspaceRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LeaveWorkspaceRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.LeaveWorkspaceRequest;

            /**
             * Decodes a LeaveWorkspaceRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LeaveWorkspaceRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.LeaveWorkspaceRequest;

            /**
             * Verifies a LeaveWorkspaceRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a LeaveWorkspaceRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns LeaveWorkspaceRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.LeaveWorkspaceRequest;

            /**
             * Creates a plain object from a LeaveWorkspaceRequest message. Also converts values to other types if specified.
             * @param message LeaveWorkspaceRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.LeaveWorkspaceRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this LeaveWorkspaceRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for LeaveWorkspaceRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ConvertWorkspaceToTeamRequest. */
        interface IConvertWorkspaceToTeamRequest {

            /** ConvertWorkspaceToTeamRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** ConvertWorkspaceToTeamRequest name */
            name?: (string|null);
        }

        /** Represents a ConvertWorkspaceToTeamRequest. */
        class ConvertWorkspaceToTeamRequest implements IConvertWorkspaceToTeamRequest {

            /**
             * Constructs a new ConvertWorkspaceToTeamRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IConvertWorkspaceToTeamRequest);

            /** ConvertWorkspaceToTeamRequest workspaceId. */
            public workspaceId: (number|Long);

            /** ConvertWorkspaceToTeamRequest name. */
            public name: string;

            /**
             * Creates a new ConvertWorkspaceToTeamRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ConvertWorkspaceToTeamRequest instance
             */
            public static create(properties?: role.v1.IConvertWorkspaceToTeamRequest): role.v1.ConvertWorkspaceToTeamRequest;

            /**
             * Encodes the specified ConvertWorkspaceToTeamRequest message. Does not implicitly {@link role.v1.ConvertWorkspaceToTeamRequest.verify|verify} messages.
             * @param message ConvertWorkspaceToTeamRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IConvertWorkspaceToTeamRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ConvertWorkspaceToTeamRequest message, length delimited. Does not implicitly {@link role.v1.ConvertWorkspaceToTeamRequest.verify|verify} messages.
             * @param message ConvertWorkspaceToTeamRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IConvertWorkspaceToTeamRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ConvertWorkspaceToTeamRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ConvertWorkspaceToTeamRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.ConvertWorkspaceToTeamRequest;

            /**
             * Decodes a ConvertWorkspaceToTeamRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ConvertWorkspaceToTeamRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.ConvertWorkspaceToTeamRequest;

            /**
             * Verifies a ConvertWorkspaceToTeamRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ConvertWorkspaceToTeamRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ConvertWorkspaceToTeamRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.ConvertWorkspaceToTeamRequest;

            /**
             * Creates a plain object from a ConvertWorkspaceToTeamRequest message. Also converts values to other types if specified.
             * @param message ConvertWorkspaceToTeamRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.ConvertWorkspaceToTeamRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ConvertWorkspaceToTeamRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ConvertWorkspaceToTeamRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ConvertWorkspaceToTeamResponse. */
        interface IConvertWorkspaceToTeamResponse {

            /** ConvertWorkspaceToTeamResponse item */
            item?: (role.v1.IWorkspaceSummary|null);
        }

        /** Represents a ConvertWorkspaceToTeamResponse. */
        class ConvertWorkspaceToTeamResponse implements IConvertWorkspaceToTeamResponse {

            /**
             * Constructs a new ConvertWorkspaceToTeamResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IConvertWorkspaceToTeamResponse);

            /** ConvertWorkspaceToTeamResponse item. */
            public item?: (role.v1.IWorkspaceSummary|null);

            /**
             * Creates a new ConvertWorkspaceToTeamResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ConvertWorkspaceToTeamResponse instance
             */
            public static create(properties?: role.v1.IConvertWorkspaceToTeamResponse): role.v1.ConvertWorkspaceToTeamResponse;

            /**
             * Encodes the specified ConvertWorkspaceToTeamResponse message. Does not implicitly {@link role.v1.ConvertWorkspaceToTeamResponse.verify|verify} messages.
             * @param message ConvertWorkspaceToTeamResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IConvertWorkspaceToTeamResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ConvertWorkspaceToTeamResponse message, length delimited. Does not implicitly {@link role.v1.ConvertWorkspaceToTeamResponse.verify|verify} messages.
             * @param message ConvertWorkspaceToTeamResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IConvertWorkspaceToTeamResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ConvertWorkspaceToTeamResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ConvertWorkspaceToTeamResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.ConvertWorkspaceToTeamResponse;

            /**
             * Decodes a ConvertWorkspaceToTeamResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ConvertWorkspaceToTeamResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.ConvertWorkspaceToTeamResponse;

            /**
             * Verifies a ConvertWorkspaceToTeamResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ConvertWorkspaceToTeamResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ConvertWorkspaceToTeamResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.ConvertWorkspaceToTeamResponse;

            /**
             * Creates a plain object from a ConvertWorkspaceToTeamResponse message. Also converts values to other types if specified.
             * @param message ConvertWorkspaceToTeamResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.ConvertWorkspaceToTeamResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ConvertWorkspaceToTeamResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ConvertWorkspaceToTeamResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ListWorkspaceUpdatesRequest. */
        interface IListWorkspaceUpdatesRequest {

            /** ListWorkspaceUpdatesRequest workspaceId */
            workspaceId?: (number|Long|null);

            /** ListWorkspaceUpdatesRequest since */
            since?: (number|Long|null);

            /** ListWorkspaceUpdatesRequest limit */
            limit?: (number|null);
        }

        /** Represents a ListWorkspaceUpdatesRequest. */
        class ListWorkspaceUpdatesRequest implements IListWorkspaceUpdatesRequest {

            /**
             * Constructs a new ListWorkspaceUpdatesRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IListWorkspaceUpdatesRequest);

            /** ListWorkspaceUpdatesRequest workspaceId. */
            public workspaceId: (number|Long);

            /** ListWorkspaceUpdatesRequest since. */
            public since: (number|Long);

            /** ListWorkspaceUpdatesRequest limit. */
            public limit: number;

            /**
             * Creates a new ListWorkspaceUpdatesRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ListWorkspaceUpdatesRequest instance
             */
            public static create(properties?: role.v1.IListWorkspaceUpdatesRequest): role.v1.ListWorkspaceUpdatesRequest;

            /**
             * Encodes the specified ListWorkspaceUpdatesRequest message. Does not implicitly {@link role.v1.ListWorkspaceUpdatesRequest.verify|verify} messages.
             * @param message ListWorkspaceUpdatesRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IListWorkspaceUpdatesRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ListWorkspaceUpdatesRequest message, length delimited. Does not implicitly {@link role.v1.ListWorkspaceUpdatesRequest.verify|verify} messages.
             * @param message ListWorkspaceUpdatesRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IListWorkspaceUpdatesRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ListWorkspaceUpdatesRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ListWorkspaceUpdatesRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.ListWorkspaceUpdatesRequest;

            /**
             * Decodes a ListWorkspaceUpdatesRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ListWorkspaceUpdatesRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.ListWorkspaceUpdatesRequest;

            /**
             * Verifies a ListWorkspaceUpdatesRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ListWorkspaceUpdatesRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ListWorkspaceUpdatesRequest
             */
            public static fromObject(object: { [k: string]: any }): role.v1.ListWorkspaceUpdatesRequest;

            /**
             * Creates a plain object from a ListWorkspaceUpdatesRequest message. Also converts values to other types if specified.
             * @param message ListWorkspaceUpdatesRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.ListWorkspaceUpdatesRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ListWorkspaceUpdatesRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ListWorkspaceUpdatesRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ListWorkspaceUpdatesResponse. */
        interface IListWorkspaceUpdatesResponse {

            /** ListWorkspaceUpdatesResponse items */
            items?: (role.v1.IWorkspaceUpdate[]|null);

            /** ListWorkspaceUpdatesResponse cursor */
            cursor?: (role.v1.ICursor|null);
        }

        /** Represents a ListWorkspaceUpdatesResponse. */
        class ListWorkspaceUpdatesResponse implements IListWorkspaceUpdatesResponse {

            /**
             * Constructs a new ListWorkspaceUpdatesResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: role.v1.IListWorkspaceUpdatesResponse);

            /** ListWorkspaceUpdatesResponse items. */
            public items: role.v1.IWorkspaceUpdate[];

            /** ListWorkspaceUpdatesResponse cursor. */
            public cursor?: (role.v1.ICursor|null);

            /**
             * Creates a new ListWorkspaceUpdatesResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ListWorkspaceUpdatesResponse instance
             */
            public static create(properties?: role.v1.IListWorkspaceUpdatesResponse): role.v1.ListWorkspaceUpdatesResponse;

            /**
             * Encodes the specified ListWorkspaceUpdatesResponse message. Does not implicitly {@link role.v1.ListWorkspaceUpdatesResponse.verify|verify} messages.
             * @param message ListWorkspaceUpdatesResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: role.v1.IListWorkspaceUpdatesResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ListWorkspaceUpdatesResponse message, length delimited. Does not implicitly {@link role.v1.ListWorkspaceUpdatesResponse.verify|verify} messages.
             * @param message ListWorkspaceUpdatesResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: role.v1.IListWorkspaceUpdatesResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ListWorkspaceUpdatesResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ListWorkspaceUpdatesResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): role.v1.ListWorkspaceUpdatesResponse;

            /**
             * Decodes a ListWorkspaceUpdatesResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ListWorkspaceUpdatesResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): role.v1.ListWorkspaceUpdatesResponse;

            /**
             * Verifies a ListWorkspaceUpdatesResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ListWorkspaceUpdatesResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ListWorkspaceUpdatesResponse
             */
            public static fromObject(object: { [k: string]: any }): role.v1.ListWorkspaceUpdatesResponse;

            /**
             * Creates a plain object from a ListWorkspaceUpdatesResponse message. Also converts values to other types if specified.
             * @param message ListWorkspaceUpdatesResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: role.v1.ListWorkspaceUpdatesResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ListWorkspaceUpdatesResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ListWorkspaceUpdatesResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Represents a WorkspacesService */
        class WorkspacesService extends $protobuf.rpc.Service {

            /**
             * Constructs a new WorkspacesService service.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             */
            constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

            /**
             * Creates new WorkspacesService service using the specified rpc implementation.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             * @returns RPC service. Useful where requests and/or responses are streamed.
             */
            public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): WorkspacesService;

            /**
             * Calls List.
             * @param request ListWorkspacesRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and ListWorkspacesResponse
             */
            public list(request: role.v1.IListWorkspacesRequest, callback: role.v1.WorkspacesService.ListCallback): void;

            /**
             * Calls List.
             * @param request ListWorkspacesRequest message or plain object
             * @returns Promise
             */
            public list(request: role.v1.IListWorkspacesRequest): Promise<role.v1.ListWorkspacesResponse>;

            /**
             * Calls GetById.
             * @param request WorkspaceIdRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and GetWorkspaceResponse
             */
            public getById(request: role.v1.IWorkspaceIdRequest, callback: role.v1.WorkspacesService.GetByIdCallback): void;

            /**
             * Calls GetById.
             * @param request WorkspaceIdRequest message or plain object
             * @returns Promise
             */
            public getById(request: role.v1.IWorkspaceIdRequest): Promise<role.v1.GetWorkspaceResponse>;

            /**
             * Calls Create.
             * @param request CreateWorkspaceRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and CreateWorkspaceResponse
             */
            public create(request: role.v1.ICreateWorkspaceRequest, callback: role.v1.WorkspacesService.CreateCallback): void;

            /**
             * Calls Create.
             * @param request CreateWorkspaceRequest message or plain object
             * @returns Promise
             */
            public create(request: role.v1.ICreateWorkspaceRequest): Promise<role.v1.CreateWorkspaceResponse>;

            /**
             * Calls ListMembers.
             * @param request WorkspaceIdRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and ListWorkspaceMembersResponse
             */
            public listMembers(request: role.v1.IWorkspaceIdRequest, callback: role.v1.WorkspacesService.ListMembersCallback): void;

            /**
             * Calls ListMembers.
             * @param request WorkspaceIdRequest message or plain object
             * @returns Promise
             */
            public listMembers(request: role.v1.IWorkspaceIdRequest): Promise<role.v1.ListWorkspaceMembersResponse>;

            /**
             * Calls AddMember.
             * @param request AddWorkspaceMemberRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and AddWorkspaceMemberResponse
             */
            public addMember(request: role.v1.IAddWorkspaceMemberRequest, callback: role.v1.WorkspacesService.AddMemberCallback): void;

            /**
             * Calls AddMember.
             * @param request AddWorkspaceMemberRequest message or plain object
             * @returns Promise
             */
            public addMember(request: role.v1.IAddWorkspaceMemberRequest): Promise<role.v1.AddWorkspaceMemberResponse>;

            /**
             * Calls CreateInvitation.
             * @param request CreateWorkspaceInvitationRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and CreateWorkspaceInvitationResponse
             */
            public createInvitation(request: role.v1.ICreateWorkspaceInvitationRequest, callback: role.v1.WorkspacesService.CreateInvitationCallback): void;

            /**
             * Calls CreateInvitation.
             * @param request CreateWorkspaceInvitationRequest message or plain object
             * @returns Promise
             */
            public createInvitation(request: role.v1.ICreateWorkspaceInvitationRequest): Promise<role.v1.CreateWorkspaceInvitationResponse>;

            /**
             * Calls UpdateMemberRole.
             * @param request UpdateWorkspaceMemberRoleRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and UpdateWorkspaceMemberRoleResponse
             */
            public updateMemberRole(request: role.v1.IUpdateWorkspaceMemberRoleRequest, callback: role.v1.WorkspacesService.UpdateMemberRoleCallback): void;

            /**
             * Calls UpdateMemberRole.
             * @param request UpdateWorkspaceMemberRoleRequest message or plain object
             * @returns Promise
             */
            public updateMemberRole(request: role.v1.IUpdateWorkspaceMemberRoleRequest): Promise<role.v1.UpdateWorkspaceMemberRoleResponse>;

            /**
             * Calls RemoveMember.
             * @param request RemoveWorkspaceMemberRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and ActionResponse
             */
            public removeMember(request: role.v1.IRemoveWorkspaceMemberRequest, callback: role.v1.WorkspacesService.RemoveMemberCallback): void;

            /**
             * Calls RemoveMember.
             * @param request RemoveWorkspaceMemberRequest message or plain object
             * @returns Promise
             */
            public removeMember(request: role.v1.IRemoveWorkspaceMemberRequest): Promise<role.v1.ActionResponse>;

            /**
             * Calls Join.
             * @param request JoinWorkspaceRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and JoinWorkspaceResponse
             */
            public join(request: role.v1.IJoinWorkspaceRequest, callback: role.v1.WorkspacesService.JoinCallback): void;

            /**
             * Calls Join.
             * @param request JoinWorkspaceRequest message or plain object
             * @returns Promise
             */
            public join(request: role.v1.IJoinWorkspaceRequest): Promise<role.v1.JoinWorkspaceResponse>;

            /**
             * Calls Leave.
             * @param request LeaveWorkspaceRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and ActionResponse
             */
            public leave(request: role.v1.ILeaveWorkspaceRequest, callback: role.v1.WorkspacesService.LeaveCallback): void;

            /**
             * Calls Leave.
             * @param request LeaveWorkspaceRequest message or plain object
             * @returns Promise
             */
            public leave(request: role.v1.ILeaveWorkspaceRequest): Promise<role.v1.ActionResponse>;

            /**
             * Calls ConvertToTeam.
             * @param request ConvertWorkspaceToTeamRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and ConvertWorkspaceToTeamResponse
             */
            public convertToTeam(request: role.v1.IConvertWorkspaceToTeamRequest, callback: role.v1.WorkspacesService.ConvertToTeamCallback): void;

            /**
             * Calls ConvertToTeam.
             * @param request ConvertWorkspaceToTeamRequest message or plain object
             * @returns Promise
             */
            public convertToTeam(request: role.v1.IConvertWorkspaceToTeamRequest): Promise<role.v1.ConvertWorkspaceToTeamResponse>;

            /**
             * Calls ListUpdates.
             * @param request ListWorkspaceUpdatesRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and ListWorkspaceUpdatesResponse
             */
            public listUpdates(request: role.v1.IListWorkspaceUpdatesRequest, callback: role.v1.WorkspacesService.ListUpdatesCallback): void;

            /**
             * Calls ListUpdates.
             * @param request ListWorkspaceUpdatesRequest message or plain object
             * @returns Promise
             */
            public listUpdates(request: role.v1.IListWorkspaceUpdatesRequest): Promise<role.v1.ListWorkspaceUpdatesResponse>;
        }

        namespace WorkspacesService {

            /**
             * Callback as used by {@link role.v1.WorkspacesService#list}.
             * @param error Error, if any
             * @param [response] ListWorkspacesResponse
             */
            type ListCallback = (error: (Error|null), response?: role.v1.ListWorkspacesResponse) => void;

            /**
             * Callback as used by {@link role.v1.WorkspacesService#getById}.
             * @param error Error, if any
             * @param [response] GetWorkspaceResponse
             */
            type GetByIdCallback = (error: (Error|null), response?: role.v1.GetWorkspaceResponse) => void;

            /**
             * Callback as used by {@link role.v1.WorkspacesService#create}.
             * @param error Error, if any
             * @param [response] CreateWorkspaceResponse
             */
            type CreateCallback = (error: (Error|null), response?: role.v1.CreateWorkspaceResponse) => void;

            /**
             * Callback as used by {@link role.v1.WorkspacesService#listMembers}.
             * @param error Error, if any
             * @param [response] ListWorkspaceMembersResponse
             */
            type ListMembersCallback = (error: (Error|null), response?: role.v1.ListWorkspaceMembersResponse) => void;

            /**
             * Callback as used by {@link role.v1.WorkspacesService#addMember}.
             * @param error Error, if any
             * @param [response] AddWorkspaceMemberResponse
             */
            type AddMemberCallback = (error: (Error|null), response?: role.v1.AddWorkspaceMemberResponse) => void;

            /**
             * Callback as used by {@link role.v1.WorkspacesService#createInvitation}.
             * @param error Error, if any
             * @param [response] CreateWorkspaceInvitationResponse
             */
            type CreateInvitationCallback = (error: (Error|null), response?: role.v1.CreateWorkspaceInvitationResponse) => void;

            /**
             * Callback as used by {@link role.v1.WorkspacesService#updateMemberRole}.
             * @param error Error, if any
             * @param [response] UpdateWorkspaceMemberRoleResponse
             */
            type UpdateMemberRoleCallback = (error: (Error|null), response?: role.v1.UpdateWorkspaceMemberRoleResponse) => void;

            /**
             * Callback as used by {@link role.v1.WorkspacesService#removeMember}.
             * @param error Error, if any
             * @param [response] ActionResponse
             */
            type RemoveMemberCallback = (error: (Error|null), response?: role.v1.ActionResponse) => void;

            /**
             * Callback as used by {@link role.v1.WorkspacesService#join}.
             * @param error Error, if any
             * @param [response] JoinWorkspaceResponse
             */
            type JoinCallback = (error: (Error|null), response?: role.v1.JoinWorkspaceResponse) => void;

            /**
             * Callback as used by {@link role.v1.WorkspacesService#leave}.
             * @param error Error, if any
             * @param [response] ActionResponse
             */
            type LeaveCallback = (error: (Error|null), response?: role.v1.ActionResponse) => void;

            /**
             * Callback as used by {@link role.v1.WorkspacesService#convertToTeam}.
             * @param error Error, if any
             * @param [response] ConvertWorkspaceToTeamResponse
             */
            type ConvertToTeamCallback = (error: (Error|null), response?: role.v1.ConvertWorkspaceToTeamResponse) => void;

            /**
             * Callback as used by {@link role.v1.WorkspacesService#listUpdates}.
             * @param error Error, if any
             * @param [response] ListWorkspaceUpdatesResponse
             */
            type ListUpdatesCallback = (error: (Error|null), response?: role.v1.ListWorkspaceUpdatesResponse) => void;
        }
    }
}
