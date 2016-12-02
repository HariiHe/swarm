"use strict";
const swarm = require('..');
const tape = require('tape').test;
const ReplicaId = swarm.ReplicaId;
const ReplicaIdScheme = swarm.ReplicaIdScheme;
const Base64x64 = swarm.Base64x64;

tape ('protocol.06.A scheme', function (tap) {

    const primusless = new ReplicaIdScheme('181');
    tap.ok(primusless.isPrimusless());
    tap.equals(primusless.primuses, 0);
    tap.equals(primusless.peers, 1);
    tap.equals(primusless.clients, 8);
    tap.equals(primusless.sessions, 1);
    tap.equals(primusless.toString(), '0181');

    const scheme = new ReplicaIdScheme(1261);
    tap.notOk(scheme.isPrimusless());
    tap.equals(scheme.primuses, 1);
    tap.equals(scheme.peers, 2);
    tap.equals(scheme.clients, 6);
    tap.equals(scheme.sessions, 1);
    tap.equals(scheme.toString(), '1261');

    tap.end();

});

tape ('protocol.06.B replica id', function (tap) {

    const scheme = new ReplicaIdScheme(1261);
    
    const id1 = ReplicaId.fromString('1ABuser003', scheme);
    tap.equals(id1.primus, '1');
    tap.equals(id1.peer, '0AB');
    tap.equals(id1.client, '000user');
    tap.equals(id1.session, '0000000003');
    tap.notOk(id1.isPeer());
    tap.ok(id1.isClient());
    tap.ok(id1.isClientOf(ReplicaId.fromString('1AB', scheme)));
    tap.ok(Base64x64.is(id1));

    const id2 = ReplicaId.fromString('1ABuser', scheme);
    tap.equals(id2.primus, '1');
    tap.equals(id2.peer, '0AB');
    tap.equals(id2.client, '000user');
    tap.equals(id2.session, '0');
    tap.ok(Base64x64.is(id2));

    const id3 = new ReplicaId('P', '0ee', '000client', '000000000S', scheme);
    tap.equals(id3.toString(), 'PeeclientS');
    tap.ok(Base64x64.is(id3));

    const id4 = ReplicaId.fromString("R", "163");
    tap.equals( id4+'', 'R' );
    const id5= id4.forkClient('0client');
    tap.equals( id5+'', 'Rclient' );
    const id6 = id5.forkSession('0000000123');
    tap.equals( id6+'', 'Rclient123' );

    tap.end();
});

tape ('protocol.06.C next', function (tap) {
    const scheme = new ReplicaIdScheme(1261);
    const next = scheme.nextPartValue('000abcdef', ReplicaIdScheme.CLIENT);
    tap.equals(next.toString(), '000abcdeg');
    const next2 = scheme.nextPartValue('000abcde', ReplicaIdScheme.CLIENT);
    tap.equals(next2.toString(), '000abcde1');
    const next3 = scheme.nextPartValue('000~~~~~~', ReplicaIdScheme.CLIENT);
    tap.equals(next3.toString(), '0');
    tap.end();
});
