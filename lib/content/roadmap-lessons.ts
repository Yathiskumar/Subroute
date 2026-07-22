import type { RoadmapLesson } from "./types";
import { classesAndObjects } from "./lld/classes-and-objects";
import { objectLifecycle } from "./lld/object-lifecycle";
import { encapsulation } from "./lld/encapsulation";
import { abstraction } from "./lld/abstraction";
import { inheritance } from "./lld/inheritance";
import { polymorphism } from "./lld/polymorphism";
import { staticVsInstance } from "./lld/static-vs-instance";
import { accessModifiers } from "./lld/access-modifiers";
import { abstractVsInterfaces } from "./lld/abstract-vs-interfaces";
import { compositionVsInheritance } from "./lld/composition-vs-inheritance";
import { associationAggregationComposition } from "./lld/association-aggregation-composition";
import { couplingAndCohesion } from "./lld/coupling-and-cohesion";
import { equalsAndHashcode } from "./lld/equals-and-hashcode";
import { immutabilityAndValueObjects } from "./lld/immutability-and-value-objects";
import { genericsAndTemplates } from "./lld/generics-and-templates";
import { enumsAndConstants } from "./lld/enums-and-constants";
import { requirementGathering } from "./lld/requirement-gathering";
import { identifyingEntities } from "./lld/identifying-entities";
import { graspPrinciples } from "./lld/grasp-principles";
import { crcCards } from "./lld/crc-cards";
import { domainModeling } from "./lld/domain-modeling";
import { apiFirstDesign } from "./lld/api-first-design";
import { classDiagrams } from "./lld/class-diagrams";
import { objectDiagrams } from "./lld/object-diagrams";
import { sequenceDiagrams } from "./lld/sequence-diagrams";
import { useCaseDiagrams } from "./lld/use-case-diagrams";
import { relationshipNotation } from "./lld/relationship-notation";
import { stateDiagrams } from "./lld/state-diagrams";
import { activityDiagrams } from "./lld/activity-diagrams";
import { componentAndDeploymentDiagrams } from "./lld/component-and-deployment-diagrams";
import { singleResponsibility } from "./lld/single-responsibility";
import { openClosed } from "./lld/open-closed";
import { liskovSubstitution } from "./lld/liskov-substitution";
import { interfaceSegregation } from "./lld/interface-segregation";
import { dependencyInversion } from "./lld/dependency-inversion";
import { dryKissYagni } from "./lld/dry-kiss-yagni";
import { lawOfDemeter } from "./lld/law-of-demeter";
import { separationOfConcerns } from "./lld/separation-of-concerns";
import { programToInterfaces } from "./lld/program-to-interfaces";
import { dependencyInjectionAndIoc } from "./lld/dependency-injection-and-ioc";
import { injectionStyles } from "./lld/injection-styles";
import { tellDontAsk } from "./lld/tell-dont-ask";
import { commandQuerySeparation } from "./lld/command-query-separation";
import { singleton } from "./lld/singleton";
import { factoryMethod } from "./lld/factory-method";
import { abstractFactory } from "./lld/abstract-factory";
import { builder } from "./lld/builder";
import { prototypePattern } from "./lld/prototype";
import { objectPool } from "./lld/object-pool";
import { adapter } from "./lld/adapter";
import { bridge } from "./lld/bridge";
import { composite } from "./lld/composite";
import { decorator } from "./lld/decorator";
import { facade } from "./lld/facade";
import { flyweight } from "./lld/flyweight";
import { proxy } from "./lld/proxy";
import { chainOfResponsibility } from "./lld/chain-of-responsibility";
import { command } from "./lld/command";
import { iterator } from "./lld/iterator";
import { mediator } from "./lld/mediator";
import { memento } from "./lld/memento";
import { observer } from "./lld/observer";
import { statePattern } from "./lld/state";
import { strategy } from "./lld/strategy";
import { templateMethod } from "./lld/template-method";
import { visitor } from "./lld/visitor";
import { nullObject } from "./lld/null-object";
import { mvcMvpMvvm } from "./lld/mvc-mvp-mvvm";
import { repository } from "./lld/repository";
import { pubSubEventDriven } from "./lld/pub-sub-event-driven";
import { patternOveruseAntiPatterns } from "./lld/pattern-overuse-anti-patterns";
import { threadsAndLifecycle } from "./lld/threads-and-lifecycle";
import { locksMutexSemaphore } from "./lld/locks-mutex-semaphore";
import { threadSafeSingleton } from "./lld/thread-safe-singleton";
import { producerConsumer } from "./lld/producer-consumer";
import { readWriteLocks } from "./lld/read-write-locks";
import { deadlockRaceStarvation } from "./lld/deadlock-race-starvation";
import { atomicOperationsAndCas } from "./lld/atomic-operations-and-cas";
import { memoryVisibility } from "./lld/memory-visibility";
import { threadPoolsAndExecutors } from "./lld/thread-pools-and-executors";
import { futuresPromisesAsync } from "./lld/futures-promises-async";
import { immutableObjectsForSafety } from "./lld/immutable-objects-for-safety";

/** Indexed by `${roadmapSlug}/${topicSlug}`. */
const ROADMAP_LESSONS: Record<string, RoadmapLesson> = {
  "lld/classes-and-objects": classesAndObjects,
  "lld/object-lifecycle": objectLifecycle,
  "lld/encapsulation": encapsulation,
  "lld/abstraction": abstraction,
  "lld/inheritance": inheritance,
  "lld/polymorphism": polymorphism,
  "lld/static-vs-instance": staticVsInstance,
  "lld/access-modifiers": accessModifiers,
  "lld/abstract-vs-interfaces": abstractVsInterfaces,
  "lld/composition-vs-inheritance": compositionVsInheritance,
  "lld/association-aggregation-composition": associationAggregationComposition,
  "lld/coupling-and-cohesion": couplingAndCohesion,
  "lld/equals-and-hashcode": equalsAndHashcode,
  "lld/immutability-and-value-objects": immutabilityAndValueObjects,
  "lld/generics-and-templates": genericsAndTemplates,
  "lld/enums-and-constants": enumsAndConstants,
  "lld/requirement-gathering": requirementGathering,
  "lld/identifying-entities": identifyingEntities,
  "lld/grasp-principles": graspPrinciples,
  "lld/crc-cards": crcCards,
  "lld/domain-modeling": domainModeling,
  "lld/api-first-design": apiFirstDesign,
  "lld/class-diagrams": classDiagrams,
  "lld/object-diagrams": objectDiagrams,
  "lld/sequence-diagrams": sequenceDiagrams,
  "lld/use-case-diagrams": useCaseDiagrams,
  "lld/relationship-notation": relationshipNotation,
  "lld/state-diagrams": stateDiagrams,
  "lld/activity-diagrams": activityDiagrams,
  "lld/component-and-deployment-diagrams": componentAndDeploymentDiagrams,
  "lld/single-responsibility": singleResponsibility,
  "lld/open-closed": openClosed,
  "lld/liskov-substitution": liskovSubstitution,
  "lld/interface-segregation": interfaceSegregation,
  "lld/dependency-inversion": dependencyInversion,
  "lld/dry-kiss-yagni": dryKissYagni,
  "lld/law-of-demeter": lawOfDemeter,
  "lld/separation-of-concerns": separationOfConcerns,
  "lld/program-to-interfaces": programToInterfaces,
  "lld/dependency-injection-and-ioc": dependencyInjectionAndIoc,
  "lld/injection-styles": injectionStyles,
  "lld/tell-dont-ask": tellDontAsk,
  "lld/command-query-separation": commandQuerySeparation,
  "lld/singleton": singleton,
  "lld/factory-method": factoryMethod,
  "lld/abstract-factory": abstractFactory,
  "lld/builder": builder,
  "lld/prototype": prototypePattern,
  "lld/object-pool": objectPool,
  "lld/adapter": adapter,
  "lld/bridge": bridge,
  "lld/composite": composite,
  "lld/decorator": decorator,
  "lld/facade": facade,
  "lld/flyweight": flyweight,
  "lld/proxy": proxy,
  "lld/chain-of-responsibility": chainOfResponsibility,
  "lld/command": command,
  "lld/iterator": iterator,
  "lld/mediator": mediator,
  "lld/memento": memento,
  "lld/observer": observer,
  "lld/state": statePattern,
  "lld/strategy": strategy,
  "lld/template-method": templateMethod,
  "lld/visitor": visitor,
  "lld/null-object": nullObject,
  "lld/mvc-mvp-mvvm": mvcMvpMvvm,
  "lld/repository": repository,
  "lld/pub-sub-event-driven": pubSubEventDriven,
  "lld/pattern-overuse-anti-patterns": patternOveruseAntiPatterns,
  "lld/threads-and-lifecycle": threadsAndLifecycle,
  "lld/locks-mutex-semaphore": locksMutexSemaphore,
  "lld/thread-safe-singleton": threadSafeSingleton,
  "lld/producer-consumer": producerConsumer,
  "lld/read-write-locks": readWriteLocks,
  "lld/deadlock-race-starvation": deadlockRaceStarvation,
  "lld/atomic-operations-and-cas": atomicOperationsAndCas,
  "lld/memory-visibility": memoryVisibility,
  "lld/thread-pools-and-executors": threadPoolsAndExecutors,
  "lld/futures-promises-async": futuresPromisesAsync,
  "lld/immutable-objects-for-safety": immutableObjectsForSafety,
};

export function getRoadmapLesson(
  roadmapSlug: string,
  topicSlug: string,
): RoadmapLesson | null {
  return ROADMAP_LESSONS[`${roadmapSlug}/${topicSlug}`] ?? null;
}

export function hasRoadmapLesson(
  roadmapSlug: string,
  topicSlug: string,
): boolean {
  return `${roadmapSlug}/${topicSlug}` in ROADMAP_LESSONS;
}

/** All authored lessons, as `{ roadmapSlug, topicSlug }` pairs for routing. */
export function getRoadmapLessonParams(): {
  roadmapSlug: string;
  topicSlug: string;
}[] {
  return Object.keys(ROADMAP_LESSONS).map((key) => {
    const [roadmapSlug, topicSlug] = key.split("/");
    return { roadmapSlug, topicSlug };
  });
}
