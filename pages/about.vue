<script setup lang="ts">
const { data } = await useAsyncData("aboutPageContent", async () => {
  const [educations, jobExperiences] = await Promise.all([queryContent("education").find(), queryContent("experiences").find()]);

  return { educations, jobExperiences };
});

const { educations, jobExperiences } = data.value!;
</script>

<template>
  <div>
    <AboutBio />
    <SectionTerminal />
    <SharedStatsBar />
    <AboutTimeline :job-experiences="jobExperiences" />
    <AboutExperience :job-experiences="jobExperiences" />
    <AboutEducation :educations="educations" />
    <SharedCtaBand />
  </div>
</template>
